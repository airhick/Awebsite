import { useWebhookNotificationsStore, type WebhookNotification } from '@/stores/webhook-notifications-store'
import { getCustomerId } from '@/lib/vapi-api-key'
import { Button } from '@/components/ui/button'
import { Phone, X } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { MarkdownRenderer } from '@/components/markdown-renderer'
import { toast } from 'sonner'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useTranslation } from '@/lib/translations'

export function WebhookSidebar() {
  const { notifications, removeNotification, clearAllNotifications } = useWebhookNotificationsStore()
  const currentCustomerId = getCustomerId()
  const t = useTranslation()
  
  // Filter notifications to only show those belonging to current customer
  const visibleNotifications = notifications.filter(
    n => n.customer_id === currentCustomerId
  )
  
  // Only show sidebar if there are notifications
  const isVisible = visibleNotifications.length > 0

  const extractCallType = (payload: any): string | null => {
    try {
      if (!payload) return null
      
      // If payload is a string, try to parse it
      let parsedPayload = payload
      if (typeof payload === 'string') {
        try {
          parsedPayload = JSON.parse(payload)
        } catch {
          return null
        }
      }
      
      // Handle n8n payload structure stored by edge function:
      // Structure: { "body": "...", "type": "...", "call_id": "...", "valeur": "..." }
      // The edge function now stores the full structure including type
      if (parsedPayload?.type) {
        return String(parsedPayload.type)
      }
      
      // Handle original n8n payload structure: array with object containing type
      // Structure: [{ "type": "...", "call_id": "...", "body": "...", "valeur": "..." }]
      if (Array.isArray(parsedPayload) && parsedPayload.length > 0) {
        const firstItem = parsedPayload[0]
        if (firstItem?.type) {
          return String(firstItem.type)
        }
      }
      
      // Try alternative field names
      if (parsedPayload?.call_type) return String(parsedPayload.call_type)
      if (parsedPayload?.callType) return String(parsedPayload.callType)
      
      // Check nested objects
      if (parsedPayload?.message?.type) return String(parsedPayload.message.type)
      if (parsedPayload?.artifact?.type) return String(parsedPayload.artifact.type)
      if (parsedPayload?.data?.type) return String(parsedPayload.data.type)
      
      return null
    } catch (e) {
      console.error('Error extracting call type:', e)
      return null
    }
  }

  const extractCallSummary = (payload: any): string => {
    try {
      // If payload is null or undefined, return default
      if (!payload) {
        return t.webhook.noSummaryAvailable
      }
      
      // If payload is directly a string, return it (this is the most common case for old format)
      if (typeof payload === 'string') {
        const trimmed = payload.trim()
        if (trimmed.length > 0) {
          return trimmed
        }
      }
      
      // Try to parse if it's a JSON string
      let parsedPayload = payload
      if (typeof payload === 'string') {
        try {
          parsedPayload = JSON.parse(payload)
        } catch {
          // If parsing fails, it's just a plain string, return it
          return payload.trim()
        }
      }
      
      // Handle new payload structure from edge function: { "body": "...", "type": "...", ... }
      // The body contains the actual summary/content
      if (parsedPayload?.body) {
        // If body is a string, return it
        if (typeof parsedPayload.body === 'string') {
          return parsedPayload.body.trim()
        }
        // If body is an object, try to extract summary from it
        if (typeof parsedPayload.body === 'object') {
          const bodyStr = parsedPayload.body.summary || 
                         parsedPayload.body.content || 
                         parsedPayload.body.message ||
                         JSON.stringify(parsedPayload.body)
          return String(bodyStr).trim()
        }
      }
      
      // Now try to find summary in various possible locations in the parsed payload
      
      // Direct summary fields
      if (parsedPayload?.summary) return String(parsedPayload.summary)
      if (parsedPayload?.call_summary) return String(parsedPayload.call_summary)
      if (parsedPayload?.callSummary) return String(parsedPayload.callSummary)
      
      // Summary in nested objects
      if (parsedPayload?.message?.summary) return String(parsedPayload.message.summary)
      if (parsedPayload?.artifact?.summary) return String(parsedPayload.artifact.summary)
      if (parsedPayload?.data?.summary) return String(parsedPayload.data.summary)
      
      // Summary in analysis
      if (parsedPayload?.analysis?.summary) return String(parsedPayload.analysis.summary)
      if (parsedPayload?.message?.analysis?.summary) return String(parsedPayload.message.analysis.summary)
      
      // Try to extract from messages array (last message)
      if (parsedPayload?.message?.artifact?.messages) {
        const msgs = parsedPayload.message.artifact.messages
        if (Array.isArray(msgs) && msgs.length > 0) {
          const lastMsg = msgs[msgs.length - 1]
          if (lastMsg?.message) return String(lastMsg.message)
          if (lastMsg?.content) return String(lastMsg.content)
        }
      }
      
      // Try messages array directly
      if (parsedPayload?.messages && Array.isArray(parsedPayload.messages) && parsedPayload.messages.length > 0) {
        const lastMsg = parsedPayload.messages[parsedPayload.messages.length - 1]
        if (lastMsg?.message) return String(lastMsg.message)
        if (lastMsg?.content) return String(lastMsg.content)
      }
      
      // Fallback to other message fields
      if (parsedPayload?.message) return String(parsedPayload.message)
      if (parsedPayload?.content) return String(parsedPayload.content)
      if (parsedPayload?.text) return String(parsedPayload.text)
      
      // Action or reason fields
      if (parsedPayload?.action) return `Action: ${parsedPayload.action}`
      if (parsedPayload?.reason) return `Reason: ${parsedPayload.reason}`
      if (parsedPayload?.customer_request) return `Customer requested: ${parsedPayload.customer_request}`
      
      // Default message
      return t.webhook.noSummaryAvailable
    } catch (e) {
      console.error('Error extracting call summary:', e, 'Payload:', payload)
      // Last resort: try to return payload as string
      if (payload && typeof payload === 'string') {
        return payload.trim()
      }
      return t.webhook.summaryExtractionError
    }
  }

  const handlePickUpCall = async (notification: WebhookNotification) => {
    if (!notification?.call_id) {
      toast.error(t.webhook.noCallIdAvailable)
      return
    }

    const callId = notification.call_id
    const callSummary = extractCallSummary(notification.payload)
    // Try to get call_type from notification first (stored in DB), then fall back to extracting from payload
    const callType = notification.call_type || extractCallType(notification.payload)
    
    // Debug: log the payload structure to help troubleshoot
    console.log('Notification payload structure:', {
      rawPayload: notification.payload,
      payloadType: typeof notification.payload,
      isArray: Array.isArray(notification.payload),
      notificationCallType: notification.call_type,
      extractedCallType: extractCallType(notification.payload),
      finalCallType: callType,
    })
    
    // Prepare webhook body with useful parameters
    const webhookBody = {
      call_id: callId,
      customer_id: notification.customer_id,
      event_type: notification.event_type,
      call_type: callType, // Include call type (from DB column or extracted from payload)
      summary: callSummary,
      created_at: notification.created_at,
      payload: notification.payload, // Include full payload for flexibility
    }
    
    console.log('Webhook body being sent:', webhookBody)

    try {
      // Send POST requests without waiting for response (fire and forget)
      // Use fetch with keepalive to ensure request completes even if page unloads
        fetch('https://n8n.goreview.fr/webhook-test/pickup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(webhookBody),
        keepalive: true, // Ensures request completes even if page closes
      }).catch((error) => {
        // Silently handle errors - we're not waiting for response anyway
        console.warn('Webhook-test/pickup request failed (non-blocking):', error)
      })

        fetch('https://n8n.goreview.fr/webhook/pickup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(webhookBody),
        keepalive: true, // Ensures request completes even if page closes
      }).catch((error) => {
        // Silently handle errors - we're not waiting for response anyway
        console.warn('Webhook/pickup request failed (non-blocking):', error)
      })

      // Show success immediately without waiting for response
        toast.success(t.webhook.callPickedUpSuccess)
      console.log('Pickup webhooks sent (fire-and-forget) for call:', callId, 'with data:', webhookBody)
    } catch (error) {
      // Only catch errors during request setup, not response
      console.error('Error setting up pickup webhooks:', error)
      toast.error(t.webhook.webhookError)
    }
  }

  if (!isVisible || visibleNotifications.length === 0) return null

  return (
    <div className="fixed right-0 top-0 h-screen w-96 bg-background border-l shadow-lg z-50 flex flex-col animate-in slide-in-from-right duration-300">
      <Card className="h-full rounded-none border-0 shadow-none flex flex-col">
        <CardHeader className="border-b flex-shrink-0">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Phone className="h-5 w-5 text-primary" />
              {t.webhook.incomingCall}
              {visibleNotifications.length > 1 && (
                <Badge variant="secondary" className="ml-2">
                  {visibleNotifications.length}
                </Badge>
              )}
            </CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                {t.webhook.new}
              </Badge>
              <Button
                variant="ghost"
                size="icon"
                onClick={clearAllNotifications}
                className="h-8 w-8"
                title="Clear all"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="flex-1 flex flex-col overflow-hidden p-0">
          <ScrollArea className="flex-1">
            <div className="space-y-4 p-4">
              {visibleNotifications.map((notification, index) => {
                const callSummary = extractCallSummary(notification.payload)
                const isLast = index === visibleNotifications.length - 1
                
                return (
                  <Card key={notification.id} className={!isLast ? "border-b-2 border-b-primary/20" : ""}>
                    <CardContent className="p-4">
            <div className="space-y-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge variant="secondary" className="bg-green-100 text-green-800">
                                #{index + 1}
                              </Badge>
                              {visibleNotifications.length > 1 && (
                                <span className="text-xs text-muted-foreground">
                                  {index === 0 ? 'First' : index === 1 ? 'Second' : index === 2 ? 'Third' : `${index + 1}th`} request
                                </span>
                              )}
                            </div>
                            <div className="rounded-lg bg-muted p-3">
                <p className="text-sm font-medium text-muted-foreground mb-2">{t.webhook.callSummary}</p>
                <div className="text-sm leading-relaxed">
                  <MarkdownRenderer content={callSummary} />
                </div>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeNotification(notification.id)}
                            className="h-8 w-8 flex-shrink-0"
                            title="Dismiss"
                          >
                            <X className="h-4 w-4" />
                          </Button>
              </div>

              <div className="flex flex-col gap-2 text-xs text-muted-foreground">
                <span>
                            {t.webhook.receivedAt} {new Date(notification.created_at).toLocaleTimeString(undefined, {
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                  })}
                </span>
                          {notification.call_id && (
                  <span className="font-mono text-xs bg-muted px-2 py-1 rounded break-all">
                              {t.webhook.callId} {notification.call_id}
                  </span>
                )}
              </div>

                        <div className="flex flex-col gap-2 pt-2 border-t">
            <Button
              variant="outline"
                            onClick={() => removeNotification(notification.id)}
              className="w-full"
                            size="sm"
            >
              <X className="h-4 w-4 mr-2" />
              {t.webhook.close}
            </Button>
            <Button
                            onClick={() => handlePickUpCall(notification)}
              className="w-full bg-green-600 hover:bg-green-700"
                            size="sm"
            >
              <Phone className="h-4 w-4 mr-2" />
              {t.webhook.pickUpCall}
            </Button>
          </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}


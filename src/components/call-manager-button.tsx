/**
 * Call Manager Button Component
 * Allows users to start a web call with a personalized call manager assistant
 * that has context from all their previous call logs
 */

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Phone, PhoneOff } from 'lucide-react'
import { getVAPIPublicApiKey, getCustomerId } from '@/lib/vapi-api-key'
import { toast } from 'sonner'
import { useTranslation } from '@/lib/translations'
import { getCallLogs, type CallLog } from '@/lib/call-logs-sync'

// VAPI Web SDK will be imported dynamically
let Vapi: any = null

const CALL_MANAGER_ASSISTANT_ID = '3413568f-9f14-42fa-816e-41db9699f7e3'

/**
 * Format call logs into context string for assistant
 */
function formatCallLogsAsContext(callLogs: CallLog[]): string {
  if (callLogs.length === 0) {
    return 'No previous call logs available.'
  }

  const contextParts: string[] = []
  contextParts.push(`You are a personalized call manager assistant. You have access to ${callLogs.length} previous call logs from this customer's AI receptionist agents.`)
  contextParts.push('\n\n## Previous Call Logs:\n')

  callLogs.forEach((log, index) => {
    const date = log.started_at 
      ? new Date(log.started_at).toLocaleString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })
      : 'Unknown date'
    
    const duration = log.duration 
      ? `${Math.floor(log.duration / 60)}m ${log.duration % 60}s`
      : 'Unknown duration'
    
    contextParts.push(`\n### Call ${index + 1} - ${date} (Duration: ${duration})`)
    
    if (log.summary) {
      contextParts.push(`Summary: ${log.summary}`)
    }
    
    // Extract transcript text
    let transcriptText = ''
    if (log.transcript) {
      if (Array.isArray(log.transcript)) {
        transcriptText = log.transcript
          .map((msg: any) => {
            const role = msg.role || 'unknown'
            const content = msg.content || msg.text || ''
            return `${role}: ${content}`
          })
          .join('\n')
      } else if (typeof log.transcript === 'string') {
        transcriptText = log.transcript
      } else if (log.transcript.content) {
        transcriptText = log.transcript.content
      }
    }
    
    // Extract messages if transcript is empty
    if (!transcriptText && log.messages) {
      if (Array.isArray(log.messages)) {
        transcriptText = log.messages
          .map((msg: any) => {
            const role = msg.role || 'unknown'
            const content = msg.content || msg.text || ''
            return `${role}: ${content}`
          })
          .join('\n')
      } else if (typeof log.messages === 'string') {
        transcriptText = log.messages
      }
    }
    
    if (transcriptText.trim()) {
      contextParts.push(`Transcript:\n${transcriptText}`)
    }
    
    if (log.ended_reason) {
      contextParts.push(`Ended reason: ${log.ended_reason}`)
    }
    
    contextParts.push('---')
  })

  contextParts.push('\n\n## Instructions:')
  contextParts.push('When the user asks about a previous call, use the information above to provide accurate details.')
  contextParts.push('You can reference specific calls by their date, duration, or content.')
  contextParts.push('If asked about decisions made by other agents, explain them based on the call logs above.')
  contextParts.push('Be helpful, concise, and accurate when referencing past calls.')

  return contextParts.join('\n')
}

export function CallManagerButton() {
  const [isCallActive, setIsCallActive] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const vapiRef = useRef<any>(null)
  const t = useTranslation()

  // Initialize VAPI instance (lazy initialization - only when needed)
  const initializeVapi = async () => {
    if (vapiRef.current) return vapiRef.current

      try {
        // Wait for VAPI to be available
        if (!Vapi) {
          const vapiModule = await import('@vapi-ai/web')
          // VAPI Web SDK exports as default
          Vapi = vapiModule.default || vapiModule
        }

        const publicKey = getVAPIPublicApiKey()
        if (!publicKey) {
        throw new Error('No public API key found')
        }

        // Create VAPI instance
        vapiRef.current = new Vapi(publicKey)

        // Listen for call status changes
        vapiRef.current.on('call-start', () => {
          console.log('[CallManagerButton] Call started')
          setIsCallActive(true)
        setIsLoading(false)
          toast.success(t.callManager?.callStarted || 'Call started!')
        })

        vapiRef.current.on('call-end', () => {
          console.log('[CallManagerButton] Call ended')
          setIsCallActive(false)
          toast.info(t.callManager?.callEnded || 'Call ended')
        })

        vapiRef.current.on('error', (error: any) => {
          console.error('[CallManagerButton] VAPI error:', error)
          setIsCallActive(false)
          setIsLoading(false)
          toast.error(t.callManager?.callError || 'Call error occurred')
        })

      return vapiRef.current
      } catch (error) {
        console.error('[CallManagerButton] Failed to initialize VAPI:', error)
      throw error
      }
    }

    // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (vapiRef.current) {
        try {
          vapiRef.current.stop()
        } catch (error) {
          console.error('[CallManagerButton] Error stopping VAPI on cleanup:', error)
        }
        vapiRef.current = null
      }
    }
  }, [])

  const toggleCall = async () => {
    if (isCallActive) {
      // Stop the call
      try {
        if (vapiRef.current) {
          vapiRef.current.stop()
          setIsCallActive(false)
          toast.info(t.callManager?.callStopped || 'Call stopped')
        }
      } catch (error: any) {
        console.error('[CallManagerButton] Error stopping call:', error)
        toast.error(t.callManager?.stopError || 'Failed to stop call')
      }
    } else {
      // Start the call
      setIsLoading(true)
      try {
        // Get customer ID
        const customerId = getCustomerId()
        if (!customerId) {
          toast.error('Customer ID not found')
          setIsLoading(false)
          return
        }

        // Fetch all call logs for this customer
        toast.info(t.callManager?.updatingContext || 'Loading your call history...')
        
        const callLogs = await getCallLogs(customerId, 100) // Get up to 100 most recent calls
        
        // Format call logs as context string
        const contextString = formatCallLogsAsContext(callLogs)
        
        // Initialize VAPI if not already done
        if (!vapiRef.current) {
          await initializeVapi()
        }

        // Start the call with context via variableValues (like websession.js)
        await vapiRef.current.start(CALL_MANAGER_ASSISTANT_ID, {
          variableValues: {
            context: contextString
          }
        })
        
        // Note: setIsCallActive will be set by the 'call-start' event
      } catch (error: any) {
        console.error('[CallManagerButton] Error starting call:', error)
        setIsCallActive(false)
        setIsLoading(false)
        toast.error(error.message || t.callManager?.startError || 'Failed to start call')
      }
    }
  }

  return (
    <Button
      onClick={toggleCall}
      disabled={isLoading}
      className="gap-2"
      variant={isCallActive ? 'destructive' : 'default'}
    >
      {isLoading ? (
        <>
          <Phone className="h-4 w-4 animate-pulse" />
          {t.callManager?.connecting || 'Connecting...'}
        </>
      ) : isCallActive ? (
        <>
          <PhoneOff className="h-4 w-4" />
          {t.callManager?.stopCall || 'Stop Call'}
        </>
      ) : (
        <>
          <Phone className="h-4 w-4" />
          {t.callManager?.button || 'Call Manager'}
        </>
      )}
    </Button>
  )
}

/**
 * Contact Form Component for Help Center
 * Sends messages to Aurora team via webhook
 */

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'
import { Loader2, Send, MessageSquare } from 'lucide-react'
import { getCustomerData } from '@/lib/vapi-api-key'
import { useTranslation } from '@/lib/translations'

const WEBHOOK_URL = 'https://n8n.goreview.fr/webhook/dbcontact'

export function ContactForm() {
  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const t = useTranslation()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!message.trim()) {
      toast.error(t.helpCenter?.messageRequired || 'Please enter a message')
      return
    }

    setIsSubmitting(true)
    
    try {
      // Get customer data
      const customerData = getCustomerData()
      
      if (!customerData.id) {
        toast.error(t.helpCenter?.customerNotFound || 'Customer information not found. Please log in again.')
        setIsSubmitting(false)
        return
      }

      // Prepare payload for webhook
      const payload = {
        customer_id: customerData.id,
        email: customerData.email || '',
        company: customerData.company || '',
        message: message.trim(),
        timestamp: new Date().toISOString()
      }

      // Send to webhook
      const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      })

      if (!response.ok) {
        throw new Error(`Webhook request failed: ${response.status} ${response.statusText}`)
      }

      // Success
      toast.success(t.helpCenter?.messageSent || 'Your message has been sent successfully!')
      setMessage('')
    } catch (error: any) {
      console.error('[ContactForm] Error sending message:', error)
      toast.error(error.message || t.helpCenter?.sendError || 'Failed to send message. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const customerData = getCustomerData()

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          <CardTitle>{t.helpCenter?.title || 'Contact Aurora Team'}</CardTitle>
        </div>
        <CardDescription>
          {t.helpCenter?.description || 'Send us a message and we\'ll get back to you as soon as possible.'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Customer Info Display */}
          <div className="space-y-2 p-4 bg-muted rounded-lg">
            <p className="text-sm font-medium">{t.helpCenter?.yourInfo || 'Your Information'}</p>
            <div className="text-sm text-muted-foreground space-y-1">
              <p>
                <span className="font-medium">{t.helpCenter?.customerId || 'Customer ID'}:</span>{' '}
                {customerData.id || t.helpCenter?.notAvailable || 'N/A'}
              </p>
              <p>
                <span className="font-medium">{t.helpCenter?.email || 'Email'}:</span>{' '}
                {customerData.email || t.helpCenter?.notAvailable || 'N/A'}
              </p>
              <p>
                <span className="font-medium">{t.helpCenter?.company || 'Company'}:</span>{' '}
                {customerData.company || t.helpCenter?.notAvailable || 'N/A'}
              </p>
            </div>
          </div>

          {/* Message Input */}
          <div className="space-y-2">
            <Label htmlFor="message">
              {t.helpCenter?.messageLabel || 'Your Message'}
            </Label>
            <Textarea
              id="message"
              placeholder={t.helpCenter?.messagePlaceholder || 'Type your message here...'}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              disabled={isSubmitting}
              rows={8}
              className="resize-none"
            />
            <p className="text-xs text-muted-foreground">
              {t.helpCenter?.messageHint || 'Please provide as much detail as possible to help us assist you better.'}
            </p>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isSubmitting || !message.trim()}
            className="w-full"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t.helpCenter?.sending || 'Sending...'}
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                {t.helpCenter?.sendButton || 'Send Message'}
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}


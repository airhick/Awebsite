import { useEffect, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import { useWebhookNotificationsStore, type WebhookNotification } from '@/stores/webhook-notifications-store'
import { getCustomerId } from '@/lib/vapi-api-key'

/**
 * Hook to listen for webhook events in real-time and add them to the notifications store
 * Only listens for events matching the current dashboard's customer_id
 */
export function useWebhookListener() {
  const { addNotification } = useWebhookNotificationsStore()
  const channelRef = useRef<any>(null)
  const customerIdRef = useRef<number | null>(null)

  // Get customer ID using the centralized function
  useEffect(() => {
    const customerId = getCustomerId()
    customerIdRef.current = customerId
  }, [])

  // Setup Realtime subscription - only for this customer's events
  useEffect(() => {
    const customerId = customerIdRef.current
    if (!customerId) {
      console.log('No customer ID found, skipping webhook listener setup')
      return
    }

    console.log(`Setting up webhook listener for customer_id: ${customerId}`)

    const channel = supabase
      .channel(`webhook-listener-${customerId}`) // Unique channel per customer
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'user_events',
          filter: `customer_id=eq.${customerId}`, // Only listen to this customer's events
        },
        (payload) => {
          console.log('Webhook event received for customer:', customerId, payload)
          const newEvent = payload.new as WebhookNotification
          
          // Double-check that the event belongs to this customer
          if (newEvent.customer_id === customerId) {
            addNotification(newEvent)
          } else {
            console.warn('Received event for different customer_id, ignoring:', {
              eventCustomerId: newEvent.customer_id,
              currentCustomerId: customerId,
            })
          }
        }
      )
      .subscribe((status) => {
        console.log(`Webhook listener subscription status for customer ${customerId}:`, status)
      })

    channelRef.current = channel

    return () => {
      if (channelRef.current) {
        console.log(`Cleaning up webhook listener for customer ${customerId}`)
        supabase.removeChannel(channelRef.current)
        channelRef.current = null
      }
    }
  }, [addNotification])
}


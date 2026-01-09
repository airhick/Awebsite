import { useState, useEffect, useRef } from 'react'
import { getCustomerId } from '@/lib/vapi-api-key'
import { supabase } from '@/lib/supabase'

export type PlanType = 'basic' | 'pro' | 'entreprise' | null

export function useCustomerPlan() {
  const [plan, setPlan] = useState<PlanType>(null)
  const [loading, setLoading] = useState(true)
  const hasFetchedRef = useRef(false)

  useEffect(() => {
    // Prevent multiple fetches
    if (hasFetchedRef.current) {
      return
    }

    // Fetch plan immediately (no delay - runs in parallel with other data)
    const fetchPlan = async () => {
      // Set flag immediately to prevent concurrent calls
      hasFetchedRef.current = true
      
      // Wrap everything in try-catch to prevent ANY errors from propagating
      try {
        const customerId = getCustomerId()
        
        if (!customerId) {
          setLoading(false)
          return
        }

        // Use RPC function to bypass RLS (similar to get_customer_agents)
        // Wrap in try-catch to prevent any errors from propagating
        let data: string | null = null
        let error: any = null
        
        try {
          const result = await supabase
            .rpc('get_customer_plan', {
              p_customer_id: customerId
            })
          
          data = result.data
          error = result.error
          
          // If we get any error (including 500s), treat it as non-critical and use fallback
          if (error) {
            console.warn('RPC returned error (non-critical), using fallback:', error.code || error.message)
            error = { ...error, code: 'FALLBACK' } // Mark for fallback
          }
        } catch (rpcError: any) {
          // Catch any thrown errors from the RPC call itself
          // Don't let network errors or 500s propagate - mark for fallback
          console.warn('RPC call threw an error (non-critical):', rpcError?.message || rpcError)
          error = { code: 'FALLBACK', message: rpcError?.message || 'RPC call failed' }
        }

        // Always try fallback if there was an error OR if no data
        if (error || !data) {
          // Fallback to direct query for any error
          try {
            const { data: fallbackData, error: fallbackError } = await supabase
              .from('customers')
              .select('plan')
              .eq('id', customerId)
              .maybeSingle()

            if (!fallbackError && fallbackData?.plan) {
              const normalizedPlan = fallbackData.plan.toLowerCase().trim()
              if (['basic', 'pro', 'entreprise'].includes(normalizedPlan)) {
                setPlan(normalizedPlan as PlanType)
              }
            } else if (fallbackError) {
              // Even fallback failed, but that's okay - just log and continue
              // Don't throw or propagate - just silently fail
              console.warn('Fallback query also failed (non-critical):', fallbackError.code || fallbackError.message)
            }
          } catch (fallbackErr: any) {
            // Silently fail - plan will remain null, component will still render
            // This catch prevents ANY error from propagating
            console.warn('Fallback query threw error (non-critical):', fallbackErr?.message || fallbackErr)
          }
          
          setLoading(false)
          return
        }

        // RPC function returns the plan string directly (or NULL)
        if (data && typeof data === 'string') {
          // Normalize plan name to lowercase
          const normalizedPlan = data.toLowerCase().trim()
          if (['basic', 'pro', 'entreprise'].includes(normalizedPlan)) {
            setPlan(normalizedPlan as PlanType)
          }
        }
      } catch (error: any) {
        // Catch ALL errors including network errors, 500s, etc.
        // This is the final safety net - prevent errors from propagating to global error handler
        // Use console.warn instead of console.error to avoid triggering error handlers
        console.warn('Error fetching customer plan (non-critical, safely handled):', error?.message || error)
        // Silently fail - plan will remain null, component will still render
        // DO NOT re-throw or let error propagate
      } finally {
        setLoading(false)
      }
    }

    fetchPlan()
  }, [])

  return { plan, loading }
}


import { useState, useEffect } from 'react'
import { getCustomerId } from '@/lib/vapi-api-key'
import { supabase } from '@/lib/supabase'

export type PlanType = 'basic' | 'pro' | 'entreprise' | null

export function useCustomerPlan() {
  const [plan, setPlan] = useState<PlanType>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPlan = async () => {
      const customerId = getCustomerId()
      
      if (!customerId) {
        setLoading(false)
        return
      }

      try {
        const { data, error } = await supabase
          .from('customers')
          .select('plan')
          .eq('id', customerId)
          .maybeSingle()

        if (error) {
          console.error('Error fetching customer plan:', error)
          setLoading(false)
          return
        }

        if (data?.plan) {
          // Normalize plan name to lowercase
          const normalizedPlan = data.plan.toLowerCase().trim()
          if (['basic', 'pro', 'entreprise'].includes(normalizedPlan)) {
            setPlan(normalizedPlan as PlanType)
          }
        }
      } catch (error) {
        console.error('Error fetching customer plan:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchPlan()
  }, [])

  return { plan, loading }
}


import { useState, useEffect, useCallback } from 'react'
import { fetchVAPIAssistant, type VAPIAssistant } from '@/lib/vapi'
import { getCustomerAgents } from '@/lib/customer-agents'
import { getVAPIApiKey, getCustomerId } from '@/lib/vapi-api-key'
import { toast } from 'sonner'

export interface AssistantWithConfig extends VAPIAssistant {
  loading?: boolean
  error?: string | null
}

export function useCustomerAssistants() {
  const [assistants, setAssistants] = useState<AssistantWithConfig[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [apiKey, setApiKey] = useState<string | null>(null)

  // Load API key on mount (global key, same for all customers)
  useEffect(() => {
    const key = getVAPIApiKey()
    setApiKey(key)
  }, [])

  // Fetch all assistant configurations
  const fetchAssistants = useCallback(async () => {
    const customerId = getCustomerId()
    
    // Get API key (global, same for all customers)
    let currentApiKey = apiKey
    if (!currentApiKey) {
      currentApiKey = getVAPIApiKey()
      setApiKey(currentApiKey)
    }
    
    if (!customerId || !currentApiKey) {
      setAssistants([])
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)

    try {
      // Get agent IDs from customer table
      const agentIds = await getCustomerAgents(customerId)
      
      if (agentIds.length === 0) {
        setAssistants([])
        setLoading(false)
        return
      }

      // Fetch configuration for each assistant
      const assistantPromises = agentIds.map(async (agentId) => {
        try {
          const config = await fetchVAPIAssistant(currentApiKey!, agentId)
          return {
            ...config,
            loading: false,
            error: null,
          } as AssistantWithConfig
        } catch (err: any) {
          console.error(`Failed to fetch assistant ${agentId}:`, err)
          return {
            id: agentId,
            loading: false,
            error: err.message || 'Failed to fetch configuration',
          } as AssistantWithConfig
        }
      })

      const results = await Promise.all(assistantPromises)
      setAssistants(results)
    } catch (err: any) {
      setError(err.message)
      console.error('Failed to fetch assistants:', err)
      toast.error('Failed to load assistant configurations')
    } finally {
      setLoading(false)
    }
  }, [apiKey])

  useEffect(() => {
    if (apiKey !== null) {
      fetchAssistants()
    }
  }, [apiKey, fetchAssistants])

  return {
    assistants,
    loading,
    error,
    refresh: fetchAssistants,
    hasApiKey: !!apiKey,
  }
}


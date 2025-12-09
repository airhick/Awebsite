/**
 * VAPI API Key Management
 * Handles retrieval and storage of VAPI API keys
 * 
 * NOTE: The VAPI API key is GLOBAL for all dashboards.
 * The filtering is done by agent IDs stored in the customers.agents column.
 */

import { useAuthStore } from '@/stores/auth-store'

/**
 * Get VAPI API key from various sources (GLOBAL key, same for all customers)
 * Priority:
 * 1. Environment variable (VITE_VAPI_API_KEY)
 * 2. localStorage (vapi_private_key) - global storage
 * 3. Fallback to default key (hardcoded for convenience)
 */
export function getVAPIApiKey(): string | null {
  // First, try environment variable (for production/build)
  const envKey = import.meta.env.VITE_VAPI_API_KEY
  if (envKey) {
    return envKey
  }

  // Fallback to localStorage (global, same for all customers)
  const localKey = localStorage.getItem('vapi_private_key')
  if (localKey) {
    return localKey
  }

  // Default API key (global for all dashboards)
  // This is the private API key provided by the user
  const defaultKey = '9d09c2ec-4223-41af-a1c9-8bb097b8e5ef'
  
  // Store it in localStorage for future use
  if (typeof window !== 'undefined') {
    localStorage.setItem('vapi_private_key', defaultKey)
  }
  
  return defaultKey
}

/**
 * Set VAPI API key in localStorage
 */
export function setVAPIApiKey(apiKey: string): void {
  localStorage.setItem('vapi_private_key', apiKey)
}

/**
 * Get customer ID from auth state or localStorage
 */
export function getCustomerId(): number | null {
  const customerData = localStorage.getItem('aurora_customer')
  if (customerData) {
    try {
      const customer = JSON.parse(customerData)
      return customer.id
    } catch (error) {
      console.error('Failed to parse customer data:', error)
    }
  }
  
  const user = useAuthStore.getState().auth.user
  if (user?.id) {
    return parseInt(user.id, 10)
  }
  
  return null
}


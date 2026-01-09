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
 * Get VAPI Public API key for Web SDK
 * Priority:
 * 1. Environment variable (VITE_VAPI_PUBLIC_API_KEY)
 * 2. localStorage (vapi_public_key)
 * 3. Fallback to default public key
 */
export function getVAPIPublicApiKey(): string | null {
  // First, try environment variable
  const envKey = import.meta.env.VITE_VAPI_PUBLIC_API_KEY
  if (envKey) {
    return envKey
  }

  // Fallback to localStorage
  const localKey = localStorage.getItem('vapi_public_key')
  if (localKey) {
    return localKey
  }

  // Default public API key (from user's provided keys)
  const defaultPublicKey = 'fc7a13ad-f97a-48eb-a0a2-8abfbd90e449'
  
  // Store it in localStorage for future use
  if (typeof window !== 'undefined') {
    localStorage.setItem('vapi_public_key', defaultPublicKey)
  }
  
  return defaultPublicKey
}

/**
 * Get customer ID from auth state or localStorage
 */
export function getCustomerId(): number | null {
  // Try localStorage first (matches custom auth flow)
  const customerData = localStorage.getItem('aurora_customer')
  if (customerData) {
    try {
      const customer = JSON.parse(customerData)
        const id = customer.id
      
      // Ensure it's a number
      const numericId = typeof id === 'string' ? parseInt(id, 10) : id
      if (isNaN(numericId)) {
        return null
      }
      return numericId
    } catch (error) {
      console.error('[getCustomerId] Failed to parse customer data:', error)
    }
  }
  
  // Fallback to auth store
  const user = useAuthStore.getState().auth.user
  if (user?.id) {
    const id = parseInt(user.id, 10)
    if (isNaN(id)) {
      return null
    }
    return id
  }
  
  return null
}

/**
 * Get customer data (id, email, company) from localStorage or auth store
 */
export function getCustomerData(): { id: number | null; email: string | null; company: string | null } {
  // Try localStorage first (matches custom auth flow)
  const customerData = localStorage.getItem('aurora_customer')
  if (customerData) {
    try {
      const customer = JSON.parse(customerData)
      return {
        id: typeof customer.id === 'string' ? parseInt(customer.id, 10) : customer.id,
        email: customer.email || null,
        company: customer.company || null
      }
    } catch (error) {
      console.error('[getCustomerData] Failed to parse customer data:', error)
    }
  }
  
  // Fallback to auth store
  const user = useAuthStore.getState().auth.user
  if (user) {
    return {
      id: user.id ? (typeof user.id === 'string' ? parseInt(user.id, 10) : user.id) : null,
      email: user.email || null,
      company: (user.user_metadata as any)?.company || null
    }
  }
  
  return { id: null, email: null, company: null }
}


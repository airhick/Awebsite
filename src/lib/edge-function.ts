/**
 * Edge Function Client
 * Calls the Supabase Edge Function to log user events from n8n
 */

import { supabase } from './supabase'

export interface EdgeFunctionPayload {
  valeur: number // customer_id
  body: any // event payload
  call_id?: string // Optional VAPI call ID
}

/**
 * Call the Supabase Edge Function to log user events
 * @param customerId - The customer ID
 * @param eventBody - The event payload to log
 * @returns Promise with success status
 */
export async function callEdgeFunction(
  customerId: number,
  eventBody: any
): Promise<{ success: boolean; message?: string; error?: string }> {
  try {
    // Get the Supabase project URL
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://oknakvgnwxlkvhwmocno.supabase.co'
    
    // Edge function name (can be overridden via env var)
    const functionName = import.meta.env.VITE_SUPABASE_EDGE_FUNCTION_NAME || 'n8n-webhook'
    
    // Edge function URL
    const edgeFunctionUrl = `${supabaseUrl}/functions/v1/${functionName}`
    
    // Prepare payload in the format expected by the edge function
    const payload: EdgeFunctionPayload[] = [
      {
        valeur: customerId,
        body: eventBody,
      },
    ]

    const response = await fetch(edgeFunctionUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Get the session token for authentication
        Authorization: `Bearer ${(await supabase.auth.getSession()).data.session?.access_token || ''}`,
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return { success: true, message: data.message }
  } catch (error: any) {
    console.error('Edge function error:', error)
    return { success: false, error: error.message || 'Failed to call edge function' }
  }
}


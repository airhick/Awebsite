/**
 * VAPI API Service
 * Handles all VAPI API interactions
 */

const VAPI_BASE_URL = 'https://api.vapi.ai'

export interface VAPICall {
  id: string
  status: string
  type: string
  startedAt?: string
  createdAt?: string
  endedAt?: string
  duration?: number
  cost?: number
  customer?: {
    number?: string
  }
  endedReason?: string
  messages?: Array<{
    role: string
    content: string
    toolCalls?: Array<{
      function: {
        name: string
        arguments: string
      }
    }>
  }>
  analysis?: {
    summary?: string
  }
  assistantId?: string
  transcript?: Array<{
    role: string
    content: string
    toolCalls?: Array<{
      function: {
        name: string
        arguments: string
      }
    }>
  }>
  artifact?: {
    recordingUrl?: string
    recording?: {
      url?: string
    }
    endedAt?: string
    ended_at?: string
    [key: string]: any
  }
}

export interface VAPIAssistant {
  id: string
  name?: string
  model?: {
    messages?: Array<{
      role: string
      content: string
    }>
    systemMessage?: string
    tools?: Array<{
      function?: {
        name: string
        description?: string
        parameters?: any
      }
      type?: string
    }>
  }
}

export async function fetchVAPICalls(
  apiKey: string,
  assistantIds?: string[],
  options?: {
    limit?: number
    createdAtGt?: string // ISO date string
    createdAtLt?: string // ISO date string for pagination
  }
): Promise<VAPICall[]> {
  // If assistantIds provided, fetch calls for each assistant and combine
  if (assistantIds && assistantIds.length > 0) {
    const allCalls: VAPICall[] = []
    let hasMore = true
    let createdAtLt: string | undefined = options?.createdAtLt
    
    // Fetch calls in batches (like the Python script)
    while (hasMore) {
      const batchCalls: VAPICall[] = []
      
      for (const assistantId of assistantIds) {
        try {
          // Build query params (similar to Python script)
          const params = new URLSearchParams()
          params.append('assistantId', assistantId)
          params.append('limit', String(options?.limit || 1000))
          
          if (options?.createdAtGt) {
            params.append('createdAtGt', options.createdAtGt)
          }
          
          if (createdAtLt) {
            params.append('createdAtLt', createdAtLt)
          }
          
          const response = await fetch(`${VAPI_BASE_URL}/call?${params.toString()}`, {
            headers: {
              'Authorization': `Bearer ${apiKey}`,
              'Content-Type': 'application/json'
            }
          })

          if (!response.ok) {
            console.warn(`Failed to fetch calls for assistant ${assistantId}:`, response.statusText)
            continue
          }

          const data = await response.json()
          const calls = Array.isArray(data) ? data : (data.results || [])
          batchCalls.push(...calls)
        } catch (error) {
          console.error(`Error fetching calls for assistant ${assistantId}:`, error)
        }
      }
      
      if (batchCalls.length === 0) {
        hasMore = false
        break
      }
      
      // Update cursor for next batch (use the oldest createdAt from this batch)
      const sortedCalls = batchCalls.sort((a, b) => {
        const aTime = a.createdAt || a.startedAt || ''
        const bTime = b.createdAt || b.startedAt || ''
        return aTime.localeCompare(bTime)
      })
      
      if (sortedCalls.length > 0) {
        createdAtLt = sortedCalls[0].createdAt || sortedCalls[0].startedAt
      }
      
      allCalls.push(...batchCalls)
      
      // If we got fewer calls than the limit, we're done
      if (batchCalls.length < (options?.limit || 1000)) {
        hasMore = false
      }
      
      // Safety limit: don't fetch more than 10,000 calls total
      if (allCalls.length >= 10000) {
        hasMore = false
      }
    }
    
    // Remove duplicates based on call ID
    const uniqueCalls = Array.from(
      new Map(allCalls.map(call => [call.id, call])).values()
    )
    
    return uniqueCalls
  }
  
  // Fetch all calls if no assistant filter (with pagination)
  const allCalls: VAPICall[] = []
  let hasMore = true
  let createdAtLt: string | undefined = options?.createdAtLt
  const limit = options?.limit || 1000

  while (hasMore) {
    const params = new URLSearchParams()
    params.append('limit', String(limit))
    
    if (options?.createdAtGt) {
      params.append('createdAtGt', options.createdAtGt)
    }
    
    if (createdAtLt) {
      params.append('createdAtLt', createdAtLt)
    }
    
    const response = await fetch(`${VAPI_BASE_URL}/call?${params.toString()}`, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      throw new Error('Failed to fetch calls. Check your API Key.')
    }

    const data = await response.json()
    const calls = Array.isArray(data) ? data : (data.results || [])
    
    if (calls.length === 0) {
      hasMore = false
      break
    }
    
    allCalls.push(...calls)
    
    // If we got fewer calls than the limit, we're done
    if (calls.length < limit) {
      hasMore = false
    } else {
      // Find the oldest createdAt for the next page
      const sortedCalls = calls.sort((a, b) => {
        const aTime = a.createdAt || a.startedAt || ''
        const bTime = b.createdAt || b.startedAt || ''
        return aTime.localeCompare(bTime)
      })
      
      if (sortedCalls.length > 0) {
        createdAtLt = sortedCalls[0].createdAt || sortedCalls[0].startedAt
      } else {
        hasMore = false
      }
    }
    
    // Safety limit: don't fetch more than 50,000 calls total
    if (allCalls.length >= 50000) {
      hasMore = false
    }
  }
  
  // Remove duplicates based on call ID
  const uniqueCalls = Array.from(
    new Map(allCalls.map(call => [call.id, call])).values()
  )
  
  return uniqueCalls
}

export async function fetchVAPICallDetail(apiKey: string, callId: string): Promise<VAPICall> {
  const response = await fetch(`${VAPI_BASE_URL}/call/${callId}`, {
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    }
  })

  if (!response.ok) {
    throw new Error('Failed to fetch call details')
  }

  return await response.json()
}

export async function fetchVAPIAssistant(apiKey: string, assistantId: string): Promise<VAPIAssistant> {
  const response = await fetch(`${VAPI_BASE_URL}/assistant/${assistantId}`, {
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    }
  })

  if (!response.ok) {
    throw new Error('Failed to fetch assistant details')
  }

  return await response.json()
}

export async function fetchVAPIAssistants(apiKey: string): Promise<VAPIAssistant[]> {
  const response = await fetch(`${VAPI_BASE_URL}/assistant`, {
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    }
  })

  if (!response.ok) {
    throw new Error('Failed to fetch assistants')
  }

  const data = await response.json()
  return Array.isArray(data) ? data : (data.results || [])
}

export function extractToolCalls(call: VAPICall) {
  const toolCalls: Array<{
    name: string
    arguments: string
    timestamp?: string
  }> = []

  if (call.messages && Array.isArray(call.messages)) {
    call.messages.forEach(msg => {
      if (msg.toolCalls && Array.isArray(msg.toolCalls)) {
        msg.toolCalls.forEach(tc => {
          if (tc?.function?.name) {
            toolCalls.push({
              name: tc.function.name,
              arguments: tc.function.arguments || '{}',
            })
          }
        })
      }
    })
  }

  if (call.transcript && Array.isArray(call.transcript)) {
    call.transcript.forEach(msg => {
      if (msg.toolCalls && Array.isArray(msg.toolCalls)) {
        msg.toolCalls.forEach(tc => {
          if (tc?.function?.name) {
            toolCalls.push({
              name: tc.function.name,
              arguments: tc.function.arguments || '{}',
            })
          }
        })
      }
    })
  }

  return toolCalls
}

export function calculateStats(calls: VAPICall[]) {
  if (!calls.length) {
    return {
      totalCalls: 0,
      live: 0,
      transferred: 0,
      totalMinutes: 0
    }
  }

  let transferred = 0
  let live = 0
  let totalMinutes = 0

  calls.forEach(call => {
    let callMinutes = 0
    
    // Calculate minutes from duration (duration is in seconds)
    if (call.duration && typeof call.duration === 'number' && call.duration > 0) {
      callMinutes = call.duration / 60 // Convert seconds to minutes
    } else {
      // If duration is not available, try to calculate from startedAt and endedAt
      if (call.startedAt) {
        const startedAt = new Date(call.startedAt).getTime()
        let endedAt: number | null = null
        
        // Check for endedAt directly on the call object
        if (call.endedAt) {
          endedAt = new Date(call.endedAt).getTime()
        }
        // Check artifact for end time
        else if (call.artifact?.endedAt) {
          endedAt = new Date(call.artifact.endedAt).getTime()
        } else if (call.artifact?.ended_at) {
          endedAt = new Date(call.artifact.ended_at).getTime()
        }
        
        if (endedAt && startedAt && endedAt > startedAt) {
          const durationSeconds = (endedAt - startedAt) / 1000
          if (durationSeconds > 0) {
            callMinutes = durationSeconds / 60
          }
        }
      }
    }
    
    totalMinutes += callMinutes

    if (['in-progress', 'ringing', 'queued'].includes(call.status)) {
      live++
    }

    const reason = call.endedReason || ''
    if (reason.includes('forward') || reason.includes('transfer') || reason === 'customer-transferred-call') {
      transferred++
    }
  })

  return {
    totalCalls: calls.length,
    transferred,
    live,
    totalMinutes: parseFloat(totalMinutes.toFixed(2))
  }
}


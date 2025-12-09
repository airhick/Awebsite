/**
 * Customer Agents Utilities
 * Handles parsing and managing agent IDs from customers table
 */

import { supabase } from './supabase'

export interface ParsedAgent {
  language: string
  agentId: string
}

/**
 * Parse agents string from customers table
 * New format: "agent-id1;agent-id2;agent-id3" separated by semicolons
 * Old format (still supported): "LANG:agent-id" separated by newlines or commas
 * Example: "3413568f-9f14-42fa-816e-41db9699f7e3;e3d981e5-a14e-4a2b-a4fb-46e53654dbdf;50545a81-f27b-43bc-8126-75773ba8e0e4"
 */
export function parseAgents(agentsString: string | null): ParsedAgent[] {
  if (!agentsString) return []
  
  const agents: ParsedAgent[] = []
  
  // Try new format first (semicolon-separated)
  if (agentsString.includes(';')) {
    const agentIds = agentsString.split(';').map(id => id.trim()).filter(Boolean)
    for (const agentId of agentIds) {
      agents.push({
        language: 'UNKNOWN', // No language info in new format
        agentId: agentId,
      })
    }
    return agents
  }
  
  // Fallback to old format (LANG:agent-id)
  const lines = agentsString.split(/\n|,|\r\n/).map(line => line.trim()).filter(Boolean)
  
  for (const line of lines) {
    const match = line.match(/^([A-Z]{2,3}):(.+)$/)
    if (match) {
      agents.push({
        language: match[1],
        agentId: match[2],
      })
    } else if (line && !line.includes(':')) {
      // If it's just an agent ID without language prefix, accept it
      agents.push({
        language: 'UNKNOWN',
        agentId: line,
      })
    }
  }
  
  return agents
}

/**
 * Extract agent IDs from agents string
 */
export function extractAgentIds(agentsString: string | null): string[] {
  if (!agentsString) return []
  
  // New format: semicolon-separated
  if (agentsString.includes(';')) {
    return agentsString.split(';').map(id => id.trim()).filter(Boolean)
  }
  
  // Old format: parse and extract
  return parseAgents(agentsString).map(agent => agent.agentId)
}

/**
 * Get customer agents from Supabase
 */
export async function getCustomerAgents(customerId: number): Promise<string[]> {
  try {
    const { data, error } = await supabase
      .from('customers')
      .select('agents')
      .eq('id', customerId)
      .maybeSingle() // Use maybeSingle() instead of single() to handle empty results gracefully
    
    if (error) {
      // Handle specific error codes
      if (error.code === 'PGRST116') {
        // No rows found - customer doesn't exist or has no agents
        console.warn(`Customer ${customerId} not found or has no agents configured`)
        return []
      }
      console.error('Error fetching customer agents:', error)
      return []
    }
    
    if (!data || !data.agents) {
      return []
    }
    
    return extractAgentIds(data.agents)
  } catch (error: any) {
    console.error('Error getting customer agents:', error)
    return []
  }
}


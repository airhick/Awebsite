/**
 * Calculate stats from call_logs table (faster than fetching from VAPI)
 * Uses a PostgreSQL RPC function for optimal performance
 */

import { supabase } from './supabase'
import { getCustomerId } from './vapi-api-key'

export interface StatsFromCallLogs {
  totalCalls: number
  live: number
  transferred: number
  totalMinutes: number
}

const CACHE_KEY = 'aurora_call_stats_cache'
const CACHE_DURATION = 30 * 1000 // 30 seconds

/**
 * Get cached stats from localStorage
 */
function getCachedStats(): StatsFromCallLogs | null {
  try {
    const cached = localStorage.getItem(CACHE_KEY)
    if (!cached) return null
    
    const { stats, timestamp } = JSON.parse(cached)
    const now = Date.now()
    
    // Return cached stats if still valid
    if (now - timestamp < CACHE_DURATION) {
      return stats
    }
    
    // Cache expired, remove it
    localStorage.removeItem(CACHE_KEY)
    return null
  } catch {
    return null
  }
}

/**
 * Cache stats in localStorage
 */
function setCachedStats(stats: StatsFromCallLogs): void {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({
      stats,
      timestamp: Date.now(),
    }))
  } catch {
    // Ignore localStorage errors
  }
}

/**
 * Calculate stats from call_logs table using PostgreSQL RPC function
 * This is much faster than fetching all rows and calculating on the client
 */
export async function calculateStatsFromCallLogs(
  customerId: number
): Promise<StatsFromCallLogs> {
  // Try to get from cache first
  const cached = getCachedStats()
  if (cached) {
    return cached
  }

  try {
    // Use RPC function for fast aggregation
    const { data, error } = await supabase.rpc('get_customer_call_stats', {
      customer_id_param: customerId,
    })

    if (error) {
      // If function doesn't exist, fallback to manual calculation
      if (error.code === '42883' || error.message?.includes('function') || error.message?.includes('does not exist')) {
        console.warn('RPC function not found, using fallback calculation. Please run supabase-stats-function.sql')
        return await calculateStatsFallback(customerId)
      }
      
      // If table doesn't exist, return empty stats
      if (error.code === 'PGRST205' || error.message?.includes('call_logs')) {
        return {
          totalCalls: 0,
          live: 0,
          transferred: 0,
          totalMinutes: 0,
        }
      }
      throw error
    }

    const stats: StatsFromCallLogs = {
      totalCalls: data?.totalCalls || 0,
      live: data?.live || 0,
      transferred: data?.transferred || 0,
      totalMinutes: data?.totalMinutes || 0,
    }

    // Cache the result
    setCachedStats(stats)

    return stats
  } catch (error: any) {
    // If table doesn't exist, return empty stats
    if (error.code === 'PGRST205') {
      return {
        totalCalls: 0,
        live: 0,
        transferred: 0,
        totalMinutes: 0,
      }
    }
    console.error('Error calculating stats from call_logs:', error)
    // Fallback to manual calculation
    return await calculateStatsFallback(customerId)
  }
}

/**
 * Fallback: Calculate stats using multiple optimized queries (faster than fetching all rows)
 */
async function calculateStatsFallback(customerId: number): Promise<StatsFromCallLogs> {
  try {
    // Use parallel queries with count and sum for better performance
    const [totalResult, liveResult, transferredResult, minutesResult] = await Promise.all([
      // Total calls count
      supabase
        .from('call_logs')
        .select('id', { count: 'exact', head: true })
        .eq('customer_id', customerId),
      
      // Live calls count
      supabase
        .from('call_logs')
        .select('id', { count: 'exact', head: true })
        .eq('customer_id', customerId)
        .in('status', ['in-progress', 'ringing', 'queued']),
      
      // Transferred calls count
      supabase
        .from('call_logs')
        .select('id', { count: 'exact', head: true })
        .eq('customer_id', customerId)
        .or('ended_reason.ilike.%forward%,ended_reason.ilike.%transfer%,ended_reason.eq.customer-transferred-call'),
      
      // Sum of durations (for total minutes)
      supabase
        .from('call_logs')
        .select('duration')
        .eq('customer_id', customerId)
        .not('duration', 'is', null)
        .limit(10000), // Limit to prevent memory issues
    ])

    const totalCalls = totalResult.count || 0
    const live = liveResult.count || 0
    const transferred = transferredResult.count || 0

    // Calculate total minutes from duration array
    let totalMinutes = 0
    if (minutesResult.data && minutesResult.data.length > 0) {
      minutesResult.data.forEach((call: any) => {
        if (call.duration && typeof call.duration === 'number' && call.duration > 0) {
          totalMinutes += call.duration / 60
        }
      })
    }

    const stats = {
      totalCalls,
      live,
      transferred,
      totalMinutes: parseFloat(totalMinutes.toFixed(2)),
    }

    // Cache the result
    setCachedStats(stats)

    return stats
  } catch (error: any) {
    if (error.code === 'PGRST205' || error.message?.includes('call_logs')) {
      return {
        totalCalls: 0,
        live: 0,
        transferred: 0,
        totalMinutes: 0,
      }
    }
    console.error('Error in fallback calculation:', error)
    throw error
  }
}


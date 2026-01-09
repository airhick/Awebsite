import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Phone, Zap, PhoneForwarded, Clock } from 'lucide-react'
import { useCustomerPlan } from '@/hooks/use-customer-plan'
import { calculateStatsFromCallLogs } from '@/lib/stats-from-call-logs'
import { getCustomerId } from '@/lib/vapi-api-key'
import { useState, useEffect } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import { useTranslation } from '@/lib/translations'
import { supabase } from '@/lib/supabase'

// Initialize stats from cache synchronously (before first render)
function getInitialStatsFromCache() {
  try {
    const cached = localStorage.getItem('aurora_call_stats_cache')
    if (cached) {
      const { stats: cachedStats, timestamp } = JSON.parse(cached)
      const now = Date.now()
      // Use cache if less than 5 minutes old
      if (now - timestamp < 5 * 60 * 1000) {
        return cachedStats
      }
    }
  } catch {
    // Ignore cache errors
  }
  return { totalCalls: 0, live: 0, transferred: 0, totalMinutes: 0 }
}

export function StatsCards() {
  const { plan } = useCustomerPlan()
  const t = useTranslation()
  // Initialize with cached stats immediately (synchronous, no loading state)
  const [stats, setStats] = useState(getInitialStatsFromCache)
  const [loading] = useState(false) // Don't show loading if we have cache

  // Load fresh stats immediately in background (non-blocking)
  useEffect(() => {
    const loadFreshStats = async () => {
      const customerId = getCustomerId()
      if (!customerId) return
      
      try {
        // Fetch total calls from customers table
        const { data: customerData, error: customerError } = await supabase
          .from('customers')
          .select('tot_calls')
          .eq('id', customerId)
          .maybeSingle()

        if (customerError) {
          // Only log non-404 errors (404 means customer doesn't exist, which is okay)
          if (customerError.code !== 'PGRST116') {
            console.error('Error fetching total calls from customers table:', customerError)
          }
        }

        // Load other stats from DB (fast RPC call) - runs in parallel
        const dbStats = await calculateStatsFromCallLogs(customerId)
        
        // Override totalCalls with value from customers.tot_calls
        setStats({
          ...dbStats,
          totalCalls: customerData?.tot_calls ?? dbStats.totalCalls ?? 0
        })
      } catch (error) {
        // Ignore errors - we have cache as fallback
        console.error('Error loading fresh stats:', error)
      }
    }

    // Start loading immediately, but don't block UI
    loadFreshStats()
  }, [])

  const planMinutes = plan
    ? {
        basic: 300,
        pro: 1000,
        entreprise: 2500,
      }[plan]
    : null

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-4 rounded" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-20 mb-2" />
              <Skeleton className="h-3 w-32" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-4">
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{t.stats.totalCalls}</CardTitle>
          <Phone className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalCalls}</div>
          <p className="text-xs text-muted-foreground">{t.stats.allTimeCalls}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{t.stats.activeLive}</CardTitle>
          <Zap className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.live}</div>
          <p className="text-xs text-muted-foreground">{t.stats.currentlyInProgress}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{t.stats.transferred}</CardTitle>
          <PhoneForwarded className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.transferred}</div>
          <p className="text-xs text-muted-foreground">{t.stats.callsTransferred}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{t.stats.totalMinutes}</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {planMinutes ? (
              <>
                {Math.round(stats.totalMinutes).toLocaleString()} / {planMinutes.toLocaleString()}
              </>
            ) : (
              Math.round(stats.totalMinutes).toLocaleString()
            )}
          </div>
        </CardContent>
      </Card>
      </div>
    </div>
  )
}


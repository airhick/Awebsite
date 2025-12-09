import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Phone, Zap, PhoneForwarded, Clock } from 'lucide-react'
import { useVAPICalls } from '@/hooks/use-vapi-calls'
import { calculateStats } from '@/lib/vapi'
import { useCustomerPlan } from '@/hooks/use-customer-plan'
import { calculateStatsFromCallLogs } from '@/lib/stats-from-call-logs'
import { getCustomerId } from '@/lib/vapi-api-key'
import { useState, useEffect } from 'react'

export function StatsCards() {
  const { calls, loading: vapiLoading } = useVAPICalls()
  const { plan } = useCustomerPlan()
  const [stats, setStats] = useState({ totalCalls: 0, live: 0, transferred: 0, totalMinutes: 0 })
  const [loading, setLoading] = useState(true)

  // Load stats from call_logs first (fast) - with immediate cache display
  useEffect(() => {
    const loadStatsFromDB = async () => {
      const customerId = getCustomerId()
      if (!customerId) {
        setLoading(false)
        return
      }

      // Try to get from cache immediately for instant display (synchronous)
      try {
        const cached = localStorage.getItem('aurora_call_stats_cache')
        if (cached) {
          const { stats: cachedStats, timestamp } = JSON.parse(cached)
          const now = Date.now()
          if (now - timestamp < 30 * 1000) {
            // Display cached stats immediately
            setStats(cachedStats)
            setLoading(false)
            // Still refresh in background (non-blocking)
            calculateStatsFromCallLogs(customerId).then((freshStats) => {
              setStats(freshStats)
            }).catch(() => {
              // Ignore errors in background refresh
            })
            return
          }
        }
      } catch {
        // Ignore cache errors
      }

      // No cache or cache expired, load from DB
      try {
        const dbStats = await calculateStatsFromCallLogs(customerId)
        setStats(dbStats)
        setLoading(false)
      } catch (error) {
        console.error('Error loading stats from DB:', error)
        setLoading(false)
      }
    }

    loadStatsFromDB()
  }, [])

  // Update stats from VAPI calls when they're loaded (more accurate, but slower)
  useEffect(() => {
    if (!vapiLoading && calls.length > 0) {
      const vapiStats = calculateStats(calls)
      setStats(vapiStats)
    }
  }, [calls, vapiLoading])

  const planMinutes = plan
    ? {
        basic: 300,
        pro: 1000,
        entreprise: 2500,
      }[plan]
    : null

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Calls</CardTitle>
          <Phone className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{loading ? '...' : stats.totalCalls}</div>
          <p className="text-xs text-muted-foreground">All time calls</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active / Live</CardTitle>
          <Zap className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{loading ? '...' : stats.live}</div>
          <p className="text-xs text-muted-foreground">Currently in progress</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Transferred</CardTitle>
          <PhoneForwarded className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{loading ? '...' : stats.transferred}</div>
          <p className="text-xs text-muted-foreground">Calls transferred</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Minutes</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {loading ? '...' : stats.totalMinutes.toLocaleString()}
            {planMinutes ? ` / ${planMinutes.toLocaleString()}` : ''}
          </div>
          <p className="text-xs text-muted-foreground">
            Total minutes used{planMinutes ? ' of your plan' : ''}
          </p>
        </CardContent>
      </Card>
    </div>
  )
}


import { useState, useEffect, lazy, Suspense } from 'react'
import { useAuthStore } from '@/stores/auth-store'
import { useCustomerSync } from '@/hooks/use-customer-sync'
import { useWebhookListener } from '@/hooks/use-webhook-listener'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { TopNav } from '@/components/layout/top-nav'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { LanguageSelector } from '@/components/language-selector'
import { WebhookPopup } from '@/components/webhook-popup'
import { PlanBadge } from '@/components/plan-badge'
import { StatsCards } from './components/stats-cards'
import { BusinessSetup } from './components/business-setup'
import { Card, CardContent } from '@/components/ui/card'
import { Loader2 } from 'lucide-react'

// Lazy load heavy components to improve initial page load
const CallDetails = lazy(() => import('./components/call-details').then(m => ({ default: m.CallDetails })))
const AssistantConfig = lazy(() => import('./components/assistant-config').then(m => ({ default: m.AssistantConfig })))
const CallLogs = lazy(() => import('./components/call-logs').then(m => ({ default: m.CallLogs })))
const RecentActivity = lazy(() => import('./components/recent-activity').then(m => ({ default: m.RecentActivity })))

export function AuroraDashboard() {
  const { user, loading } = useAuthStore((state) => state.auth)
  const [needsSetup, setNeedsSetup] = useState(false)
  
  // Sync user to customers table
  useCustomerSync()
  
  // Listen for webhook events in real-time
  useWebhookListener()

  useEffect(() => {
    // Show setup/login screen if user is not authenticated
    if (!loading && !user) {
      setNeedsSetup(true)
    } else if (user) {
      setNeedsSetup(false)
    }
  }, [user, loading])

  const handleSetupComplete = () => {
    setNeedsSetup(false)
  }

  const handleStartTest = () => {
    // This would be handled by the TestInterface component
    console.log('Start test from Recent Activity')
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-lg">Loading your dashboard...</div>
      </div>
    )
  }

  if (needsSetup) {
    return (
      <>
        <Header showSidebarTrigger={false}>
          <TopNav links={topNav} />
          <div className="ms-auto flex items-center space-x-4">
            <PlanBadge />
            <LanguageSelector />
            <ThemeSwitch />
            <ProfileDropdown />
          </div>
        </Header>
        <Main>
          <BusinessSetup onComplete={handleSetupComplete} />
        </Main>
      </>
    )
  }

  return (
    <>
      <Header>
        <TopNav links={topNav} />
        <div className="ms-auto flex items-center space-x-4">
          <Search />
          <PlanBadge />
          <LanguageSelector />
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>

      {/* Webhook Popup - Shows when a webhook event is received */}
      <WebhookPopup />

      <Main>
        <div className="space-y-6">
          {/* Page Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Welcome back, {user?.user_metadata?.first_name || user?.email?.split('@')[0]}
              </h1>
              <p className="text-muted-foreground">
                Here's an overview of your AI receptionist
              </p>
            </div>
          </div>

          {/* Stats Cards */}
          <StatsCards />

          {/* VAPI Information Grid - Lazy loaded */}
          <div className="grid gap-6 lg:grid-cols-1">
            <Suspense fallback={<Card><CardContent className="pt-6"><div className="flex items-center justify-center py-8"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div></CardContent></Card>}>
              <CallDetails />
            </Suspense>
          </div>

          {/* Assistant Configuration - Lazy loaded */}
          <Suspense fallback={<Card><CardContent className="pt-6"><div className="flex items-center justify-center py-8"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div></CardContent></Card>}>
            <AssistantConfig />
          </Suspense>

          {/* Call Logs - Lazy loaded */}
          <Suspense fallback={<Card><CardContent className="pt-6"><div className="flex items-center justify-center py-8"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div></CardContent></Card>}>
            <CallLogs />
          </Suspense>

          {/* Recent Activity - Lazy loaded */}
          <Suspense fallback={<Card><CardContent className="pt-6"><div className="flex items-center justify-center py-8"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div></CardContent></Card>}>
            <RecentActivity onStartTest={handleStartTest} />
          </Suspense>

          {/* Info Cards */}
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-1 space-y-3">
                    <p className="font-semibold">Built for Excellence</p>
                    <h3 className="text-2xl font-bold">Aurora AI Receptionist</h3>
                    <p className="text-sm text-muted-foreground">
                      Experience the future of call handling with our advanced AI
                      technology that learns and adapts to your business needs.
                    </p>
                  </div>
                  <div className="flex h-24 w-24 items-center justify-center rounded-lg bg-primary/10 p-2">
                    <img 
                      src="/logos/aurora-logo.png" 
                      alt="Aurora Logo" 
                      className="h-full w-full object-contain"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-primary/10 to-primary/5">
              <CardContent className="flex h-full flex-col justify-between pt-6">
                <div className="space-y-3">
                  <h3 className="text-xl font-bold">Work Smarter, Not Harder</h3>
                  <p className="text-sm text-muted-foreground">
                    Let Aurora handle your calls while you focus on growing your
                    business. Our AI receptionist works 24/7 to ensure you never
                    miss an opportunity.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </Main>
    </>
  )
}

const topNav = [
  {
    title: 'Dashboard',
    href: '/',
    isActive: true,
    disabled: false,
  },
]


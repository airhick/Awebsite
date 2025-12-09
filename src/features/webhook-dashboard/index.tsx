import { useEffect, useState, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/stores/auth-store'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { TopNav } from '@/components/layout/top-nav'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Zap, Loader2, CheckCircle2, XCircle, Trash2, Phone } from 'lucide-react'

interface UserEvent {
  id: number
  customer_id: number
  event_type: string
  payload: any
  created_at: string
  call_id?: string | null
}

const topNav = [
  { title: 'Dashboard', url: '/dashboard' },
  { title: 'Webhook', url: '/webhook' },
]

export function WebhookDashboard() {
  const { user } = useAuthStore((state) => state.auth)
  const [events, setEvents] = useState<UserEvent[]>([])
  const [isConnected, setIsConnected] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const channelRef = useRef<any>(null)
  const customerIdRef = useRef<number | null>(null)

  // Get customer ID
  useEffect(() => {
    const customerData = localStorage.getItem('aurora_customer')
    if (customerData) {
      try {
        const customer = JSON.parse(customerData)
        customerIdRef.current = customer.id
      } catch (error) {
        console.error('Failed to parse customer data:', error)
      }
    } else if (user?.id) {
      customerIdRef.current = parseInt(user.id, 10)
    }
  }, [user])

  // Load existing events
  useEffect(() => {
    const loadEvents = async () => {
      if (!customerIdRef.current) return

      try {
        const { data, error } = await supabase
          .from('user_events')
          .select('*')
          .eq('customer_id', customerIdRef.current)
          .order('created_at', { ascending: false })
          .limit(50)

        if (error) {
          console.error('Error loading events:', error)
        } else {
          setEvents(data || [])
        }
      } catch (error) {
        console.error('Error loading events:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadEvents()
  }, [])

  // Setup Realtime subscription
  useEffect(() => {
    if (!customerIdRef.current) {
      setIsLoading(false)
      return
    }

    const channel = supabase
      .channel('webhook-dashboard')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'user_events',
          filter: `customer_id=eq.${customerIdRef.current}`,
        },
        (payload) => {
          console.log('New event received:', payload)
          const newEvent = payload.new as UserEvent
          setEvents((prev) => [newEvent, ...prev])
        }
      )
      .subscribe((status) => {
        console.log('Subscription status:', status)
        setIsConnected(status === 'SUBSCRIBED')
        if (status === 'SUBSCRIBED') {
          setIsLoading(false)
        }
      })

    channelRef.current = channel

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current)
      }
    }
  }, [])

  const extractUserMessage = (payload: any): string => {
    try {
      if (payload?.message?.artifact?.messages) {
        const msgs = payload.message.artifact.messages
        const lastMsg = msgs[msgs.length - 1]
        if (lastMsg?.message) return lastMsg.message
      }
      if (payload?.message) return String(payload.message)
      if (payload?.action) return `Action: ${payload.action}`
      if (payload?.reason) return `Transfer reason: ${payload.reason}`
      if (payload?.customer_request) return `Customer requested: ${payload.customer_request}`
      return 'Call transfer request - User wanted to speak with a human agent'
    } catch (e) {
      return 'Call transfer request - User wanted to speak with a human agent'
    }
  }

  return (
    <>
      <Header>
        <TopNav links={topNav} />
        <div className="ms-auto flex items-center space-x-4">
          <Search />
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>

      <Main>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Incoming Calls</h1>
              <p className="text-muted-foreground">
                Past calls where users requested to be transferred to a human agent
              </p>
            </div>
            <div className="flex items-center gap-2">
              {isConnected ? (
                <Badge variant="default" className="bg-green-100 text-green-800 hover:bg-green-100">
                  <CheckCircle2 className="mr-1 h-3 w-3" />
                  Connecté
                </Badge>
              ) : (
                <Badge variant="secondary" className="bg-red-100 text-red-800">
                  <XCircle className="mr-1 h-3 w-3" />
                  Déconnecté
                </Badge>
              )}
              {customerIdRef.current && (
                <Badge variant="outline">
                  Customer ID: {customerIdRef.current}
                </Badge>
              )}
            </div>
          </div>

          <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Phone className="h-5 w-5" />
                <h2 className="text-xl font-bold">Call Transfer Requests</h2>
              </div>
              <p className="text-sm text-muted-foreground">
                These are calls where the AI receptionist detected that the caller wanted to speak with a human agent. 
                Each event represents a transfer request that was sent to n8n for processing.
              </p>

              {isLoading ? (
                <Card>
                  <CardContent className="flex items-center justify-center py-12">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                  </CardContent>
                </Card>
              ) : events.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-12 text-muted-foreground italic border-dashed">
                    No transfer requests yet. When a caller requests to speak with a human, 
                    the event will appear here automatically.
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {events.map((event) => {
                    const userMessage = extractUserMessage(event.payload)
                    return (
                      <Card key={event.id} className="overflow-hidden">
                        <div className="border-b bg-muted/50 p-4 flex justify-between items-center">
                          <span className="font-semibold text-sm">Transfer Request</span>
                          <div className="flex items-center gap-3">
                            <span className="text-xs text-muted-foreground">
                              {new Date(event.created_at).toLocaleTimeString('fr-FR', {
                                hour: '2-digit',
                                minute: '2-digit',
                                second: '2-digit',
                              })}
                            </span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                              onClick={async () => {
                                try {
                                  const { error } = await supabase
                                    .from('user_events')
                                    .delete()
                                    .eq('id', event.id)

                                  if (error) {
                                    console.error('Error deleting event:', error)
                                  } else {
                                    setEvents((prev) => prev.filter((e) => e.id !== event.id))
                                  }
                                } catch (error) {
                                  console.error('Error deleting event:', error)
                                }
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <CardContent className="p-4">
                          <div className="mb-3">
                            <span className="text-sm font-semibold text-muted-foreground">Call Summary:</span>
                            <p className="text-lg font-medium mt-1">
                              {typeof userMessage === 'string' ? userMessage : JSON.stringify(userMessage)}
                            </p>
                            <p className="text-xs text-muted-foreground mt-2">
                              This call was transferred because the caller requested to speak with a human agent.
                            </p>
                          </div>
                          <details className="group">
                            <summary className="flex items-center gap-2 text-xs font-medium text-primary cursor-pointer hover:text-primary/80 select-none">
                              <span>Voir le JSON brut</span>
                              <svg
                                className="w-4 h-4 transition-transform group-open:rotate-180"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M19 9l-7 7-7-7"
                                />
                              </svg>
                            </summary>
                            <div className="mt-2">
                              <pre className="bg-slate-900 text-green-400 p-4 rounded-lg overflow-x-auto text-xs">
                                {JSON.stringify(event.payload, null, 2)}
                              </pre>
                            </div>
                          </details>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              )}
          </div>
        </div>
      </Main>
    </>
  )
}


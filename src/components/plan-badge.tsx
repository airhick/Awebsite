import { Badge } from '@/components/ui/badge'
import { useCustomerPlan } from '@/hooks/use-customer-plan'
import { Crown, Zap, Building2 } from 'lucide-react'

export function PlanBadge() {
  const { plan, loading } = useCustomerPlan()

  if (loading || !plan) {
    return null
  }

  const planConfig = {
    basic: {
      label: 'Basic',
      variant: 'secondary' as const,
      icon: Zap,
    },
    pro: {
      label: 'Pro',
      variant: 'default' as const,
      icon: Crown,
    },
    entreprise: {
      label: 'Entreprise',
      variant: 'default' as const,
      icon: Building2,
    },
  }

  const config = planConfig[plan]
  if (!config) return null

  const planMinutes = {
    basic: 300,
    pro: 1000,
    entreprise: 2500,
  } as const

  const Icon = config.icon

  return (
    <Badge variant={config.variant} className="flex items-center gap-2 px-2.5 py-1">
      <Icon className="h-3 w-3" />
      <span className="text-xs font-medium">
        {config.label} · {planMinutes[plan]} min
      </span>
    </Badge>
  )
}


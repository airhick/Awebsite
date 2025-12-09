import { createFileRoute } from '@tanstack/react-router'
import { WebhookDashboard } from '@/features/webhook-dashboard'

export const Route = createFileRoute('/_authenticated/webhook')({
  component: WebhookDashboard,
})

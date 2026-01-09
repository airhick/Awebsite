import { createFileRoute } from '@tanstack/react-router'
import LandingPage from '@/components/landing/LandingPage'

export const Route = createFileRoute('/')({
  component: IndexPage,
})

function IndexPage() {
  // Always show landing page at root path, regardless of authentication status
  return <LandingPage />
}


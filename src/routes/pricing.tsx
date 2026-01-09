import { createFileRoute } from '@tanstack/react-router'
import { useEffect } from 'react'

export const Route = createFileRoute('/pricing')({
  component: PricingPage,
})

function PricingPage() {
  useEffect(() => {
    // Redirect to Calendly immediately
    window.location.href = 'https://calendly.com/aurora-internal/30min'
  }, [])

  return (
    <div className="flex min-h-screen items-center justify-center bg-white dark:bg-[#050505] transition-colors duration-300">
      <div className="text-center space-y-4">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-900 dark:border-white border-t-transparent mx-auto" />
        <p className="text-lg text-gray-900 dark:text-white">Redirecting to booking page...</p>
      </div>
    </div>
  )
}


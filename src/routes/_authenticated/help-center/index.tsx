import { createFileRoute } from '@tanstack/react-router'
import { ContactForm } from '@/features/help-center/contact-form'
import { useTranslation } from '@/lib/translations'

export const Route = createFileRoute('/_authenticated/help-center/')({
  component: HelpCenterPage,
})

function HelpCenterPage() {
  const t = useTranslation()

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">
            {t.helpCenter?.pageTitle || 'Help Center'}
          </h1>
          <p className="text-muted-foreground">
            {t.helpCenter?.pageDescription || 'Get in touch with the Aurora team for support and assistance.'}
          </p>
        </div>
        
        <ContactForm />
      </div>
    </div>
  )
}

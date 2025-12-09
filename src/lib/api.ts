import { supabase } from './supabase'
import { useAuthStore } from '@/stores/auth-store'

/**
 * Crawl a website and extract markdown content
 */
export async function crawlWebsite(url: string): Promise<{ markdown: string }> {
  try {
    // For now, we'll simulate the crawling with a mock response
    // In production, this should call a backend service
    console.log('Crawling URL:', url)
    
    // Simulated response
    await new Promise((resolve) => setTimeout(resolve, 2000))
    
    return {
      markdown: `# Business Information from ${url}\n\nThis is placeholder content extracted from your website. In production, this would contain actual content from your website.`,
    }
  } catch (error) {
    console.error('Error crawling website:', error)
    throw new Error('Failed to crawl website')
  }
}

/**
 * Create or update a customer record
 */
export async function createCustomer(data: {
  email: string
  first_name?: string
  last_name?: string
  phone?: string
  title?: string
}): Promise<any> {
  try {
    // Check for Supabase Auth session
    const { data: { session } } = await supabase.auth.getSession()
    
    // Also check for custom auth session (from cookies/localStorage)
    const authState = useAuthStore.getState().auth
    const hasCustomSession = authState.user && authState.session
    
    // If no session at all, skip (don't throw error for custom auth users)
    if (!session && !hasCustomSession) {
      // For custom auth, the customer already exists in the database
      // We don't need to create/update it via this function
      console.log('No Supabase Auth session found. Skipping customer sync (custom auth users already have customer records).')
      return null
    }
    
    // For custom auth users, skip this sync as they already have customer records
    if (hasCustomSession && !session) {
      console.log('Custom auth session detected. Skipping customer sync (customer record already exists).')
      return null
    }

    // Check if customer exists
    const { data: existing, error: fetchError } = await supabase
      .from('customers')
      .select('*')
      .eq('email', data.email)
      .single()

    if (fetchError && fetchError.code !== 'PGRST116') {
      // PGRST116 is "not found" error, which is expected for new customers
      throw fetchError
    }

    if (existing) {
      // Update existing customer
      const { data: updated, error: updateError } = await supabase
        .from('customers')
        .update({
          first_name: data.first_name,
          last_name: data.last_name,
          phone: data.phone,
          title: data.title,
          updated_at: new Date().toISOString(),
        })
        .eq('id', existing.id)
        .select()
        .single()

      if (updateError) throw updateError
      return updated
    } else {
      // Create new customer
      const defaultCompanyId = import.meta.env.VITE_SUPABASE_DEFAULT_COMPANY_ID

      const { data: created, error: insertError } = await supabase
        .from('customers')
        .insert({
          email: data.email,
          first_name: data.first_name,
          last_name: data.last_name,
          phone: data.phone,
          title: data.title,
          company_id: defaultCompanyId,
        })
        .select()
        .single()

      if (insertError) throw insertError
      return created
    }
  } catch (error) {
    console.error('Error creating/updating customer:', error)
    throw error
  }
}


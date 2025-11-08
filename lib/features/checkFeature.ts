import { createClient } from '@/lib/supabase/server'

export async function checkFeature(featureName: string): Promise<boolean> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('settings')
      .select('enabled')
      .eq('feature_name', featureName)
      .single()

    if (error || !data) {
      return false
    }

    return data.enabled === true
  } catch (error) {
    // Supabase unavailable - return false
    return false
  }
}


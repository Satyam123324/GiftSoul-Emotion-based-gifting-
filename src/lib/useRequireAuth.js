'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabase'

/*
  Usage in a page that needs protection:

  export default function Dashboard() {
    const { user, loading } = useRequireAuth()
    if (loading) return <div>Loading...</div>
    if (!user) return null // useRequireAuth already redirected
    ...rest of your page
  }
*/
export function useRequireAuth() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true

    supabase.auth.getSession().then(({ data }) => {
      if (!active) return
      if (!data.session) {
        router.push('/login')
      } else {
        setUser(data.session.user)
      }
      setLoading(false)
    })

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        router.push('/login')
        setUser(null)
      } else {
        setUser(session.user)
      }
    })

    return () => {
      active = false
      listener.subscription.unsubscribe()
    }
  }, [router])

  return { user, loading }
}
'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from './supabase'

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
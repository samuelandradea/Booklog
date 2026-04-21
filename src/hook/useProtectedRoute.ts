import { useAuth } from '@/context/authContext'
import { router } from 'expo-router'
import { useEffect } from 'react'

export function useProtectedRoute() {
    const { user, loading } = useAuth()

    useEffect(() => {
        if (!loading && !user) {
            router.replace('/')
        }
    }, [user, loading])

    return { user, loading }
}
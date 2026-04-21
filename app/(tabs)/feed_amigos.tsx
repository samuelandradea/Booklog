import { useProtectedRoute } from "@/hook/useProtectedRoute"

export default function feed_amigos(){
    const { user, loading } = useProtectedRoute()
    
    if (loading) return null
    return
}
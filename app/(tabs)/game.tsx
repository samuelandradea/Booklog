import { useProtectedRoute } from "@/hook/useProtectedRoute"

export default function game(){
    const { user, loading } = useProtectedRoute()
    
    if (loading) return null
    return
}
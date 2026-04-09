import { useProtectedRoute } from "@/hook/useProtectedRoute"

export default function minhas_listas(){
  const { user, loading } = useProtectedRoute()

  if (loading) return null    
    return
}
import { useProtectedRoute } from "@/hook/useProtectedRoute"
import { Text, View } from "react-native"


export default function Amizades() {
  const { user, loading } = useProtectedRoute()

  if (loading) return null
  return (
    <View style={{ flex: 1, backgroundColor: "#D4AA94" }}>
      <Text>Amizades</Text>
    </View>
  )
}
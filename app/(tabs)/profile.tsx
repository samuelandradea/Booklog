import { CarrosselLivros } from "@/components/CarrosselLivros"
import { Divider } from "@/components/Divider"
import { MenuOpcao } from "@/components/MenuOpcao"
import { useProtectedRoute } from "@/hook/useProtectedRoute"
import { Ionicons } from "@expo/vector-icons"
import { router } from "expo-router"
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from "react-native"

const leituras = [
  { id: "1", nome: "Dom Quixote", nota: "9/10" },
  { id: "2", nome: "1984", nota: "10/10" },
  { id: "3", nome: "O Hobbit", nota: "8/10" },
  { id: "4", nome: "Duna", nota: "9/10" },
]

export default function profile(){  
  const { user, loading } = useProtectedRoute()

  if (loading) return null
    return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.select({ ios: "padding", android: "height"})}>
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
            <View style={styles.header}>
                <View style={styles.avatar}>
                    <Ionicons name="person" size={40} color="#D4AA94" />
                </View>
                <View style={styles.headerTextos}>
                    <Text style={styles.username}>nome de usuário</Text>
                    <Text style={styles.bio}>"biografia do usuário</Text>
                </View>
            </View>

            <MenuOpcao label="Leituras recentes" onPress={() => router.push("/lidos_recente")} />

            <Divider style={styles.dividerCompacto} />

            <CarrosselLivros
                titulo=""
                dados={leituras}
                mostrarBolinhas={false}
            />

            <MenuOpcao label="Configurações" onPress={() => router.push("/configuracoes")} />
            <Divider style={styles.dividerCompacto}/>
            <MenuOpcao label="Amizades" onPress={() => router.push("/amizades")} />
            <Divider style={styles.dividerCompacto}/>
            <MenuOpcao label="Minhas listas" onPress={() => router.push("/minhas_listas")} />
            <Divider style={styles.dividerCompacto}/>

        </ScrollView>
    </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    scrollView: {
        flex: 1,
        backgroundColor: "#D4AA94",
    },
    content: {
        padding: 24,
        paddingTop: 60,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        gap: 16,
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: "#6F1D1B",
        alignItems: "center",
        justifyContent: "center",
    },
    headerTextos: {
        flex: 1,
    },
    username: {
        fontFamily: "Poppins_700Bold",
        fontSize: 20,
        color: "#6F1D1B",
    },
    bio: {
        fontFamily: "RedHatDisplay_500Medium",
        fontStyle: "italic",
        fontSize: 13,
        color: "#500903",
    },
    dividerCompacto: {
        marginVertical: 4,
    },
})
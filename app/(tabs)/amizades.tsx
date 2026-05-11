import { Divider } from "@/components/Divider";
import { Header } from "@/components/Header";
import { AmizadesController, Amigo } from "@/controllers/amizadesController";
import { CardAmizade } from "@/components/CardAmizade";
import { useProtectedRoute } from "@/hook/useProtectedRoute";
import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
 
const controller = new AmizadesController();
 
export default function Amizades() {
  const { loading } = useProtectedRoute();
  const [amigos, setAmigos] = useState<Amigo[]>([]);
  const [carregando, setCarregando] = useState(true);
 
  useFocusEffect(
    useCallback(() => {
      carregarAmigos();
    }, []),
  );
 
  async function carregarAmigos() {
    setCarregando(true);
    const data = await controller.carregarAmigos();
    setAmigos(data);
    setCarregando(false);
  }
 
  function removerAmigo(targetUid: string, nome: string) {
    controller.removerAmigo(targetUid, nome, () => {
      setAmigos((prev) => prev.filter((a) => a.id !== targetUid));
    });
  }
 
  if (loading) return null;
 
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.select({ ios: "padding", android: "height" })}
    >
      <FlatList
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        data={amigos}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <>
            <Header />
              {/* HEADER */}
              <View style={styles.headerRow}>
                  <TouchableOpacity onPress={() => router.push("/profile")}>
                      <Ionicons name="chevron-back" size={24} color="#500903" />
                  </TouchableOpacity>
                  <Text style={styles.titulo}>Amizades</Text>
              </View>
 
            <Divider style={styles.dividerCompacto} />
 
            {carregando && (
              <ActivityIndicator size="large" color="#500903" style={{ marginTop: 40 }} />
            )}
 
            {!carregando && amigos.length === 0 && (
              <Text style={styles.vazio}>Você ainda não segue ninguém.</Text>
            )}
          </>
        }
        renderItem={({ item }) => (
          <CardAmizade
            nome={item.name}
            onPressPrincipal={() =>
              router.push({ pathname: "/perfilAmizade", params: { uid: item.id } })
            }
            onPressAcao={() => removerAmigo(item.id, item.name)}
          />
        )}
      />
    </KeyboardAvoidingView>
  );
}
 
const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: "#D4AA94",
  },
  content: {
    padding: 24,
    paddingTop: 48,
    gap: 12,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 4,
  },
  logo: {
    fontFamily: "Poppins_700Bold",
    fontSize: 24,
    color: "#6F1D1B",
  },
  titulo: {
    fontFamily: "Poppins_700Bold",
    fontSize: 22,
    color: "#500903",
  },
  dividerCompacto: {
    marginVertical: 4,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#6F1D1B",
    alignItems: "center",
    justifyContent: "center",
  },
  vazio: {
    textAlign: "center",
    marginTop: 40,
    fontFamily: "RedHatDisplay_500Medium",
    color: "#500903",
    fontSize: 16,
  },
});
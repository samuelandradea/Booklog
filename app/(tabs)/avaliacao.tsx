import { Header } from "@/components/Header";
import { useProtectedRoute } from "@/hook/useProtectedRoute";
import { useLocalSearchParams, router } from "expo-router";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

export default function MinhaAvaliacao() {
  const { loading } = useProtectedRoute();
  const { nomeLivro, nomeAutor, nota, resenha, thumbnail } =
    useLocalSearchParams();

  if (loading) return null;

  const thumbnailSegura = thumbnail
    ? (thumbnail as string).replace("http:", "https:")
    : null;

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <ScrollView contentContainerStyle={styles.content}>
        <Header />

        <TouchableOpacity style={styles.voltar} onPress={() => router.push('/(tabs)/profile')}>
          <Ionicons name="chevron-back" size={28} color="#500903" />
          <Text style={styles.voltarTexto}>Voltar</Text>
        </TouchableOpacity>

        <View style={styles.topoContainer}>
          <View style={styles.capa}>
            {thumbnailSegura ? (
              <Image
                source={{ uri: thumbnailSegura }}
                style={styles.capaImagem}
              />
            ) : (
              <Text style={styles.capaTexto}>Livro</Text>
            )}
          </View>

          <View style={styles.infoContainer}>
            <Text style={styles.infoLabel}>Minha nota:</Text>
            <View style={styles.badge}>
              <Text style={styles.badgeTexto}>{nota}/5</Text>
            </View>
          </View>
        </View>

        <Text style={styles.nomeLivro}>{nomeLivro}</Text>
        <Text style={styles.nomeAutor}>{nomeAutor}</Text>

        <Text style={styles.resenhaLabel}>Minha resenha:</Text>
        <View style={styles.resenhaContainer}>
          <Text style={styles.resenhaTexto}>{resenha}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#D4AA94",
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  voltar: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  voltarTexto: {
    color: "#500903",
    fontFamily: "Poppins_700Bold",
    fontSize: 16,
  },
  topoContainer: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 12,
  },
  capa: {
    width: 140,
    height: 200,
    backgroundColor: "#6F1D1B",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  capaImagem: {
    width: 140,
    height: 200,
    borderRadius: 12,
  },
  capaTexto: {
    color: "#D4AA94",
    fontSize: 24,
    fontWeight: "bold",
  },
  infoContainer: {
    flex: 1,
    gap: 6,
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#500903",
    fontFamily: "Poppins_700Bold",
  },
  badge: {
    backgroundColor: "#6F1D1B",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  badgeTexto: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 14,
  },
  nomeLivro: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#500903",
    fontFamily: "Poppins_700Bold",
    marginTop: 8,
  },
  nomeAutor: {
    fontSize: 14,
    color: "#500903",
    marginBottom: 16,
  },
  resenhaLabel: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#500903",
    fontFamily: "Poppins_700Bold",
    marginBottom: 8,
  },
  resenhaContainer: {
    backgroundColor: "transparent",
  },
  resenhaTexto: {
    fontSize: 14,
    color: "#500903",
    fontWeight: "bold",
    lineHeight: 22,
  },
});

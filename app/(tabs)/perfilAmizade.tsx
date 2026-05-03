import { CarrosselLivros } from "@/components/CarrosselLivros";
import { Divider } from "@/components/Divider";
import { Header } from "@/components/Header";
import { MenuOpcao } from "@/components/MenuOpcao";
import { PerfilAmizadeController } from "@/controllers/perfilAmigoController";
import { useProtectedRoute } from "@/hook/useProtectedRoute";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
 
const controller = new PerfilAmizadeController();
 
export default function PerfilAmizade() {
  const { loading } = useProtectedRoute();
  const { uid: targetUid } = useLocalSearchParams<{ uid: string }>();
 
  const [nome, setNome] = useState("");
  const [bio, setBio] = useState("");
  const [reviews, setReviews] = useState<any[]>([]);
  const [seguindo, setSeguindo] = useState(false);
  const [carregando, setCarregando] = useState(true);
  const [loadingAcao, setLoadingAcao] = useState(false);
 
  useFocusEffect(
    useCallback(() => {
      if (!targetUid) return;
      carregarPerfil();
    }, [targetUid]),
  );
 
  async function carregarPerfil() {
    setCarregando(true);
    const data = await controller.carregarPerfil(targetUid);
    if (data) {
      setNome(data.nome);
      setBio(data.bio);
      setSeguindo(data.seguindo);
      setReviews(data.reviews);
    }
    setCarregando(false);
  }
 
  async function handleToggleSeguir() {
    if (loadingAcao) return;
    setLoadingAcao(true);
    const novoEstado = await controller.toggleSeguir(targetUid, seguindo);
    setSeguindo(novoEstado);
    setLoadingAcao(false);
  }
 
  if (loading) return null;
 
  if (carregando) {
    return (
      <View style={[styles.scrollView, { justifyContent: "center", alignItems: "center" }]}>
        <ActivityIndicator size="large" color="#500903" />
      </View>
    );
  }
 
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.select({ ios: "padding", android: "height" })}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <Header />
 
        {/* avatar, nome, bio e botao de seguir — mesmo layout do configuracoes */}
        <View style={styles.avatarRow}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={40} color="#D4AA94" />
          </View>
          <View style={styles.camposLaterais}>
            <Text style={styles.username}>{nome || "Usuário"}</Text>
            {bio ? <Text style={styles.bio}>{bio}</Text> : null}
            <TouchableOpacity
              style={[styles.botaoSeguir, seguindo && styles.botaoSeguindo]}
              onPress={handleToggleSeguir}
              disabled={loadingAcao}
              activeOpacity={0.8}
            >
              <Text style={styles.botaoSeguirTexto}>
                {loadingAcao ? "..." : seguindo ? "seguindo" : "adicionar"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
 
        <MenuOpcao label="Leituras recentes" onPress={() => {}} />
 
        <Divider style={styles.dividerCompacto} />
 
        {reviews.length === 0 ? (
          <Text style={styles.semLivros}>Nenhum livro adicionado</Text>
        ) : (
          <CarrosselLivros
            titulo=""
            dados={reviews.map((r) => ({
              id: r.id || r.bookIsbn || "",
              isbn13: r.bookIsbn || "",
              titulo: r.nomeLivro || "Título Desconhecido",
              autores: r.nomeAutor || "Autor Desconhecido",
              capa: r.thumbnail || "",
              notaMedia: r.nota || 0,
              categoria: "",
            }))}
            mostrarBolinhas={false}
          />
        )}
      </ScrollView>
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
    marginTop: 4,
  },
  dividerCompacto: {
    marginVertical: 4,
  },
  avatarRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "#6F1D1B",
    alignItems: "center",
    justifyContent: "center",
  },
  camposLaterais: {
    flex: 1,
    gap: 6,
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
  botaoSeguir: {
    backgroundColor: "#6F1D1B",
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: "flex-start",
  },
  botaoSeguindo: {
    backgroundColor: "#A0522D",
  },
  botaoSeguirTexto: {
    fontFamily: "Poppins_700Bold",
    fontSize: 13,
    color: "#EDD5C0",
  },
  semLivros: {
    color: "#500903",
    fontFamily: "RedHatDisplay_500Medium",
  },
})
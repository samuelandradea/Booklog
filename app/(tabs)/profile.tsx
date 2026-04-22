import { CarrosselLivros } from "@/components/CarrosselLivros";
import { Divider } from "@/components/Divider";
import { Header } from "@/components/Header"
import { MenuOpcao } from "@/components/MenuOpcao";
import { PerfilController } from "@/controllers/perfilController";
import { useProtectedRoute } from "@/hook/useProtectedRoute";
import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View} from "react-native";
import { useCallback, useState } from "react";
import { api } from "@/lib/api";
import { auth } from "@/lib/firebase";


const controller = new PerfilController();

// tela responsavel por exibir os dados do perfil do usuario autenticado
export default function Profile() {
  const { user, loading } = useProtectedRoute();

  // gerenciamento do estado local para os dados exibidos na tela
  const [nome, setNome] = useState("");
  const [bio, setBio] = useState("");
  const [reviews, setReviews] = useState<any[]>([]);
  
  // useFocusEffect garante que os dados sejam recarregados toda vez que a tela recebe foco
  useFocusEffect(
    useCallback(() => {
      const uid = auth.currentUser?.uid;
      if (!uid) return;
      
      controller.carregarPerfil(uid).then((perfil) => {
        if (perfil) {
          setNome(perfil.nome)
          setBio(perfil.bio)
        }
      })
      
      // busca as reviews do usuario e enriquece cada uma com a capa do livro correspondente
      api(`/users/${uid}/reviews`)
        .then(async (data) => {
          const reviewsComCapa = await Promise.all(
            // limita a 4 reviews e busca a thumbnail de cada livro pela isbn
            data.slice(0, 4).map(async (review: any) => {
              try {
                const livro = await api(`/books/${review.bookIsbn}`);
                return { ...review, thumbnail: livro.thumbnail };
              } catch {
                // caso a capa nao seja encontrada, retorna a review sem thumbnail
                return review;
              }
            }),
          );
          setReviews(reviewsComCapa);
        })
        .catch((err) => console.error("Erro ao buscar reviews:", err));

    }, []),
  );

  // aguarda a verificacao de autenticacao antes de renderizar a tela
  if (loading) return null;

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

        {/* cabecalho do perfil com avatar, nome e bio do usuario */}
        <View style={styles.header}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={40} color="#D4AA94" />
          </View>
          <View style={styles.headerTextos}>
            <Text style={styles.username}>{nome || "Usuário"}</Text>
            {/* bio só aparece se existir */}
            {bio ? <Text style={styles.bio}>{bio}</Text> : null}
          </View>
        </View>

        <MenuOpcao
          label="Leituras recentes"
          onPress={() => router.push("/lidos_recente")}
        />

        <Divider style={styles.dividerCompacto} />

        {reviews.length === 0 ? (
          <Text
            style={{
              color: "#500903",
              fontFamily: "RedHatDisplay_500Medium",
              marginBottom: 12,
            }}
          >
            Nenhum livro adicionado
          </Text>
        ) : (
          <CarrosselLivros
            titulo=""
            dados={reviews.map((r) => ({
              ...r,
              title: r.nomeLivro,
              average_rating: r.nota,
            }))}
            mostrarBolinhas={false}
          />
        )}

        <MenuOpcao
          label="Amizades" onPress={() => router.push("/amizades")}
        />
        <Divider style={styles.dividerCompacto} />
        <MenuOpcao 
          label="Minhas Listas" onPress={() => router.push("/minhas_listas")}
        />
        <Divider style={styles.dividerCompacto} />
        <MenuOpcao
          label="Configurações" onPress={() => router.push("/configuracoes")}
        />
        <Divider style={styles.dividerCompacto} />
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
});

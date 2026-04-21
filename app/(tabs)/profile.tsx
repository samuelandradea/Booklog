import { CarrosselLivros } from "@/components/CarrosselLivros";
import { Divider } from "@/components/Divider";
import { MenuOpcao } from "@/components/MenuOpcao";
import { useProtectedRoute } from "@/hook/useProtectedRoute";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useCallback, useState } from "react";
import { useFocusEffect } from "expo-router";
import { api } from "@/lib/api";
import { auth } from "@/lib/firebase";

export default function profile() {
  const { user, loading } = useProtectedRoute();

  if (loading) return null;

  const [reviews, setReviews] = useState<any[]>([]);
  useFocusEffect(
    useCallback(() => {
      const uid = auth.currentUser?.uid;
      if (uid) {
        api(`/users/${uid}/reviews`)
          .then(async (data) => {
            const reviewsComCapa = await Promise.all(
              data.slice(0, 4).map(async (review: any) => {
                try {
                  const livro = await api(`/books/${review.bookIsbn}`);
                  return { ...review, thumbnail: livro.thumbnail };
                } catch {
                  return review;
                }
              }),
            );
            setReviews(reviewsComCapa);
          })
          .catch((err) => console.error(err));
      }
    }, []),
  );

  const emailCompleto = auth.currentUser?.email || "";
  const nomeUsuario =
    auth.currentUser?.displayName ||
    emailCompleto
      .split("@")[0]
      .replace(".", " ")
      .replace(/\b\w/g, (c) => c.toUpperCase()) ||
    "Usuário";

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
        <View style={styles.header}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={40} color="#D4AA94" />
          </View>
          <View style={styles.headerTextos}>
            <Text style={styles.username}>{nomeUsuario}</Text>
            <Text style={styles.bio}>"biografia do usuário</Text>
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
            Nenhum livro lido ainda
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
          label="Configurações"
          onPress={() => router.push("/configuracoes")}
        />
        <Divider style={styles.dividerCompacto} />
        <MenuOpcao label="Amizades" onPress={() => router.push("/amizades")} />
        <Divider style={styles.dividerCompacto} />
        <MenuOpcao
          label="Minhas listas"
          onPress={() => router.push("/minhas_listas")}
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

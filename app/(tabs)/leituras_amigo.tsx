import { useCallback, useState } from "react";
import { useFocusEffect, router, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
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

import { PerfilAmizadeController } from "@/controllers/perfilAmigoController";
import { CardLivro } from "@/components/CardLivro";
import { Divider } from "@/components/Divider";
import { Header } from "@/components/Header";
import { useProtectedRoute } from "@/hook/useProtectedRoute";

const controller = new PerfilAmizadeController();

// Tela de leitura: mostra todas as avaliações de um amigo (somente leitura)
export default function LeiturasAmigo() {
  const { loading } = useProtectedRoute();
  const { uid, nome } = useLocalSearchParams<{ uid: string; nome: string }>();

  const [reviews, setReviews] = useState<any[]>([]);
  const [carregando, setCarregando] = useState(true);

  useFocusEffect(
    useCallback(() => {
      if (!uid) return;
      setCarregando(true);
      controller.carregarTodasReviews(uid)
        .then((data) => setReviews(data))
        .catch((err) => console.error(err))
        .finally(() => setCarregando(false));
    }, [uid])
  );

  if (loading) return null;

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.select({ ios: "padding", android: "height" })}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        style={{ backgroundColor: "#D4AA94" }}
      >
        <View style={styles.container}>

          <Header />

          <View style={styles.subHeaderContainer}>
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="chevron-back" size={30} color="#500903" />
            </TouchableOpacity>

            <View style={{ flex: 1 }}>
              <Text style={styles.title}>Leituras de {nome || "amigo"}</Text>
              <Divider />
            </View>
          </View>

          {carregando ? (
            <ActivityIndicator size="large" color="#500903" />
          ) : reviews.length === 0 ? (
            <Text style={styles.emptyText}>
              Nenhum livro lido ainda
            </Text>
          ) : (
            <View style={styles.grid}>
              {reviews.map((item) => (
                <CardLivro
                  key={item.id}
                  nome={item.nomeLivro}
                  nota={String(item.nota)}
                  thumbnail={item.img ? item.img.replace("http:", "https:") : undefined}
                  variante="grid"
                  onPress={() =>
                    router.push({
                      pathname: "/avaliacao",
                      params: {
                        titulo: item.nomeLivro,
                        autor: item.nomeAutor,
                        capa: item.img || "",
                        nota: String(item.nota),
                        resenha: item.resenha || "",
                        usuario: nome || "",
                      },
                    })
                  }
                />
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 60,
  },
  subHeaderContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 20,
    gap: 5,
  },
  title: {
    fontFamily: "Poppins_700Bold",
    fontSize: 20,
    color: "#500903",
    textAlign: "right",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  emptyText: {
    color: "#500903",
    fontFamily: "Poppins_700Bold",
    textAlign: "center",
    marginTop: 40,
  },
});

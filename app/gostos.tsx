import { useCallback, useState } from "react";
import { useFocusEffect, router } from "expo-router";
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

import { LeituraController } from "@/controllers/leituraController";
import { CardLivro } from "@/components/CardLivro";
import { Divider } from "@/components/Divider";
import { Header } from "@/components/Header";
import { useProtectedRoute } from "@/hook/useProtectedRoute";

export default function Leituras() {

  // Hook que já protege rota e fornece usuário autenticado
  const { user, loading } = useProtectedRoute();

  // Estados da tela
  const [reviews, setReviews] = useState<any[]>([]);
  const [carregando, setCarregando] = useState(true);

  // Instância do controller (POO correto)
  const controller = new LeituraController();

  // Executa sempre que a tela entra em foco
  useFocusEffect(
    useCallback(() => {
      const uid = user?.uid;

      if (uid) {
        controller.buscarReviews(uid)
          .then(data => setReviews(data))
          .catch((err) => console.error(err))
          .finally(() => setCarregando(false));
      } else {
        setCarregando(false);
      }
    }, [user])
  );

  // Enquanto verifica autenticação
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

          {/* Cabeçalho global */}
          <Header />

          {/* Subheader: voltar + título */}
          <View style={styles.subHeaderContainer}>
            <TouchableOpacity onPress={() => router.push("/(tabs)/profile")}>
              <Ionicons name="chevron-back" size={30} color="#500903" />
            </TouchableOpacity>

            <View style={{ flex: 1 }}>
              <Text style={styles.title}>Leituras recentes</Text>
              <Divider />
            </View>
          </View>

          {/* Conteúdo */}
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
                  nota={item.nota}
                  thumbnail={item.thumbnail}
                  variante="grid"
                  onPress={() =>
                    router.push({
                      pathname: "/editar_avaliacao",
                      params: {
                        id: item.id,
                        nomeLivro: item.nomeLivro,
                        nota: item.nota,
                        resenha: item.resenha,
                        thumbnail: item.thumbnail || "",
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
    justifyContent: "flex-start",
  },

  emptyText: {
    color: "#500903",
    fontFamily: "Poppins_700Bold",
    textAlign: "center",
    marginTop: 40,
  },
});
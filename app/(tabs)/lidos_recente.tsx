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
import { IReview } from "@/models/ReviewModel";

export default function Leituras() {

  // Verifica se o usuário está logado e redireciona para login se não estiver
  const { user, loading } = useProtectedRoute();

  // Lista de reviews do usuário retornadas pelo backend
  const [reviews, setReviews] = useState<IReview[]>([]);

  // Controla o estado de carregamento enquanto busca as reviews
  const [carregando, setCarregando] = useState(true);

  // Instância do controller responsável pela lógica de negócio das leituras
  const controller = new LeituraController();

  // Busca as reviews sempre que a tela recebe foco (ex: ao voltar de outra tela)
  useFocusEffect(
    useCallback(() => {
      const uid = user?.uid;

      if (uid) {
        controller.buscarReviews(uid)
          .then((data: IReview[]) => setReviews(data))
          .catch((err: any) => console.error(err))
          .finally(() => setCarregando(false));
      } else {
        setCarregando(false);
      }
    }, [user])
  );

  // Aguarda a verificação de autenticação antes de renderizar
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

          {/* Cabeçalho global do app */}
          <Header />

          {/* Subheader com botão de voltar e título da tela */}
          <View style={styles.subHeaderContainer}>
            <TouchableOpacity onPress={() => router.push("/(tabs)/profile")}>
              <Ionicons name="chevron-back" size={30} color="#500903" />
            </TouchableOpacity>

            <View style={{ flex: 1 }}>
              <Text style={styles.title}>Leituras recentes</Text>
              <Divider />
            </View>
          </View>

          {/* Renderização condicional: carregando / vazio / lista de livros */}
          {carregando ? (
            // Exibe spinner enquanto busca os dados no backend
            <ActivityIndicator size="large" color="#500903" />

          ) : reviews.length === 0 ? (

            // Exibe mensagem quando o usuário ainda não tem livros lidos
            <Text style={styles.emptyText}>
              Nenhum livro lido ainda
            </Text>

          ) : (

            // Grade de cards de livros lidos
            <View style={styles.grid}>
              {reviews.map((item) => (
                <CardLivro
                  key={item.id}
                  nome={item.nomeLivro}
                  nota={String(item.nota)}
                  thumbnail={item.thumbnail}
                  variante="grid"
                  // Ao clicar, navega para a tela de edição passando os dados da review
                  onPress={() =>
                    router.push({
                      pathname: "/edicao",
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

  // Linha horizontal com botão de voltar e título
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

  // Grade responsiva de cards de livros
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },

  // Mensagem exibida quando não há livros lidos
  emptyText: {
    color: "#500903",
    fontFamily: "Poppins_700Bold",
    textAlign: "center",
    marginTop: 40,
  },
});
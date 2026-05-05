import { CardLivro } from "@/components/CardLivro";
import { Divider } from "@/components/Divider";
import { Header } from "@/components/Header";
import { ListController } from "@/controllers/listController";
import { useProtectedRoute } from "@/hook/useProtectedRoute";
import { IListBookFull } from "@/models/listModel";
import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import React, { useCallback, useState } from "react";
import { ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function dentroLista(){
 // Verifica se o usuário está logado e redireciona para login se não estiver
  const { user, loading } = useProtectedRoute();

  // Lista de livros da lista retornadas pelo backend
  const [livros, setLivros] = useState<IListBookFull[]>([]);

  // Controla o estado de carregamento enquanto busca as reviews
  const [carregando, setCarregando] = useState(true);

  // Instância do controller responsável pela lógica de negócio das leituras
  const controller = new ListController();

  //Controla o nome da lista
  const [nomeLista, setNomeLista] = useState("")

  //Recebe o id da lista
  const { listId } = useLocalSearchParams();

  // Busca as reviews sempre que a tela recebe foco (ex: ao voltar de outra tela)
  useFocusEffect(
    useCallback(() => {
        if (listId) {
            controller.buscarLivrosDaLista(listId as string)
                .then(({ nome, livros }) => {
                    setNomeLista(nome)
                    setLivros(livros)
                })
                .catch(err => console.error(err))
                .finally(() => setCarregando(false))
        }
    }, [listId])
)

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
            <TouchableOpacity onPress={() => router.push("/(tabs)/minhas_listas")}>
              <Ionicons name="chevron-back" size={30} color="#500903" />
            </TouchableOpacity>

            <View style={{ flex: 1 }}>
              <Text style={styles.title}>{nomeLista}</Text>
              <Divider />
            </View>
          </View>

          {/* Renderização condicional: carregando / vazio / lista de livros */}
          {carregando ? (
            // Exibe spinner enquanto busca os dados no backend
            <ActivityIndicator size="large" color="#500903" />

          ) : livros.length === 0 ? (

            // Exibe mensagem quando o usuário ainda não tem livros lidos
            <Text style={styles.emptyText}>
              Nenhum livro lido ainda
            </Text>

          ) : (

            // Grade de cards de livros lidos
            <View style={styles.grid}>
              {livros.map((item) => (
                <CardLivro
                  key={item.bookIsbn}
                  nome={item.titulo}
                  nota=""
                  thumbnail={item.thumbnail}
                  variante="grid"
                  ocultarTextos= {false}
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
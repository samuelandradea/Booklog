import { useProtectedRoute } from "@/hook/useProtectedRoute";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { CardPesquisaAutor } from "../../src/components/CardPesquisaAutor";
import { CardPesquisaLivro } from "../../src/components/CardPesquisaLivro";
import { CardPesquisaUsuario } from "../../src/components/CardPesquisaUsuario";
import { Header } from "../../src/components/Header";
import { SearchBar } from "../../src/components/SearchBar";

export default function TelaPesquisa() {
  const { user, loading } = useProtectedRoute();

  if (loading) return null;
  const router = useRouter();
  const params = useLocalSearchParams();
  const queryInicial = (params.q as string) || "";

  const [textoBusca, setTextoBusca] = useState(queryInicial);
  const [carregando, setCarregando] = useState(false);
  const [pesquisaFeita, setPesquisaFeita] = useState(false);
  const [resultados, setResultados] = useState({
    usuarios: [],
    livros: [],
    autores: [],
  });

  useEffect(() => {
    if (queryInicial) {
      buscarDados(queryInicial);
    }
  }, [queryInicial]);

  const buscarDados = async (termo: string) => {
    if (!termo) return;
    setCarregando(true);
    setPesquisaFeita(true);

    try {
      const response = await fetch(`http://127.0.0.1:8000/search?q=${termo}`);
      const data = await response.json();
      setResultados(data);
    } catch (error) {
      console.error("Erro de conexão:", error);
      setResultados({ usuarios: [], livros: [], autores: [] });
    } finally {
      setCarregando(false);
    }
  };

  const fazerNovaBusca = () => {
    router.setParams({ q: textoBusca });
  };

  const nenhumResultado =
    resultados.usuarios.length === 0 &&
    resultados.livros.length === 0 &&
    resultados.autores.length === 0;

  return (
    <View style={styles.container}>
      <Header />

      <View style={styles.searchContainer}>
        <SearchBar
          mostrarBotaoLocalizacao={false}
          placeholderText="Pesquise por livros, autores ou usuários"
          value={textoBusca}
          onChangeText={setTextoBusca}
          onSubmitEditing={fazerNovaBusca}
        />
      </View>

      {carregando ? (
        <ActivityIndicator
          size="large"
          color="#500903"
          style={{ marginTop: 50 }}
        />
      ) : pesquisaFeita && nenhumResultado ? (
        <View style={styles.emptyContainer}>
          <Image
            source={require("../../src/assets/booklog-logo.png")}
            style={styles.imagemVazia}
            resizeMode="contain"
          />
          <Text style={styles.emptyTitle}>Nenhum resultado</Text>
          <Text style={styles.emptyTitle}>encontrado</Text>
          <Text style={styles.emptySubtitle}>Tente buscar por outro</Text>
          <Text style={styles.emptySubtitle}>livro ou autor</Text>
        </View>
      ) : (
        <ScrollView
          style={styles.resultsContainer}
          showsVerticalScrollIndicator={false}
        >
          {resultados.usuarios.map((user: any) => (
            <CardPesquisaUsuario key={user.id} nome={user.name} />
          ))}

          {resultados.autores.map((autor: any) => (
            <CardPesquisaAutor key={autor.id} nome={autor.authors} />
          ))}
          {resultados.livros.map((livro: any) => (
            <CardPesquisaLivro
              key={livro.id}
              titulo={livro.title}
              autor={livro.authors}
              categoria={livro.categories || "Sem categoria"}
              nota={livro.average_rating ? `${livro.average_rating}/5` : "-/5"}
              thumbnail={livro.thumbnail} // Passa a imagem
            />
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#D9B39A",
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  searchContainer: { marginBottom: 30 },
  resultsContainer: { flex: 1 },
  emptyContainer: { flex: 1, alignItems: "center", marginTop: 50 },
  imagemVazia: { width: 150, height: 150, marginBottom: 20 },
  emptyTitle: { fontFamily: "Poppins_700Bold", fontSize: 22, color: "#500903" },
  emptySubtitle: {
    fontFamily: "RedHatDisplay_500Medium",
    fontSize: 14,
    color: "#500903",
    marginTop: 5,
  },
});

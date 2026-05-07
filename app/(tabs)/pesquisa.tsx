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

// IMPORTANDO A NOSSA ARQUITETURA POO
import {
  IPesquisaResultado,
  PesquisaController,
} from "@/controllers/pesquisaController";

/**
 * Componente principal da Tela de Pesquisa.
 * Responsável por receber o *input* do usuário, acionar o Controller para buscar os dados
 * e exibir os resultados (Livros, Autores e Usuários) de forma categorizada e rolável.
 */
export default function TelaPesquisa() {
  // Proteção de rota: garante que apenas usuários logados acessem a pesquisa
  const { user, loading } = useProtectedRoute();

  const router = useRouter();

  // Capta os parâmetros da URL
  const params = useLocalSearchParams();
  const queryInicial = (params.q as string) || "";

  // ==========================================
  // ESTADOS (STATES) DA TELA
  // ==========================================

  // Controle do texto que está digitado no campo de busca
  const [textoBusca, setTextoBusca] = useState(queryInicial);

  // Controle de interface: exibe ou esconde o "spinner" de carregamento
  const [carregando, setCarregando] = useState(false);

  // Controle lógico: sabe dizer se o usuário já tentou pesquisar algo ou se a tela acabou de abrir
  const [pesquisaFeita, setPesquisaFeita] = useState(false);

  // Estado que armazena os dados que voltam do back-end, já tipados com a nossa Interface POO
  const [resultados, setResultados] = useState<IPesquisaResultado>({
    usuarios: [],
    livros: [],
    autores: [],
  });

  // Se a autenticação ainda estiver carregando, não renderiza nada (evita falhas visuais)
  if (loading) return null;

  // ==========================================
  // EFEITOS (USE EFFECT)
  // ==========================================

  /**
   * Gatilho automático: Toda vez que a `queryInicial` mudar (ex: usuário veio da Home
   * com um termo já preenchido), este efeito dispara a busca automaticamente.
   */
  useEffect(() => {
    if (queryInicial) {
      buscarDados(queryInicial);
    }
  }, [queryInicial]);

  // ==========================================
  // MÉTODOS DE AÇÃO
  // ==========================================

  /**
   * Função central de busca. Delega o trabalho pesado para a Controller.
   * @param termo A string de pesquisa digitada pelo usuário.
   */
  const buscarDados = async (termo: string) => {
    if (!termo) return; // Trava de segurança: não pesquisa vazio

    setCarregando(true);
    setPesquisaFeita(true);

    // DELEGANDO PARA A CONTROLLER: A tela não sabe como a API funciona,
    // ela só pede os dados para o "Gerente" (Controller) e aguarda a resposta.
    const data = await PesquisaController.buscar(termo);
    setResultados(data);

    setCarregando(false);
  };

  /**
   * Atualiza os parâmetros da URL com o novo texto digitado.
   * Ao fazer isso, o `useEffect` lá de cima "percebe" a mudança e dispara o `buscarDados`.
   */
  const fazerNovaBusca = () => {
    router.setParams({ q: textoBusca });
  };

  // Variável auxiliar para descobrir se todas as listas de resultado voltaram vazias
  const nenhumResultado =
    resultados.usuarios.length === 0 &&
    resultados.livros.length === 0 &&
    resultados.autores.length === 0;

  // ==========================================
  // RENDERIZAÇÃO VISUAL (JSX)
  // ==========================================
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

      {/* Renderização Condicional (If/Else Visual):
          1. Se estiver 'carregando', mostra o Spinner.
          2. Senão, se a pesquisa foi feita e 'nenhumResultado' é verdadeiro, mostra a imagem de vazio.
          3. Senão (tem dados), mostra a lista rolável com os componentes. */}
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
          contentContainerStyle={{ paddingBottom: 40 }} // Margem de respiro no fim da lista
        >
          {resultados.usuarios.map((user: any) => (
            <CardPesquisaUsuario key={user.id} nome={user.name} />
          ))}

          {resultados.autores.map((autor: any) => (
            <CardPesquisaAutor key={autor.id} nome={autor.authors} />
          ))}

          {resultados.livros.map((livro) => (
            <CardPesquisaLivro
              key={livro.id}
              // O nosso Builder já limpou e traduziu tudo! O Card recebe dados perfeitamente seguros.
              titulo={livro.titulo}
              autor={livro.autores}
              categoria={livro.categoria}
              nota={livro.notaMedia > 0 ? `${livro.notaMedia}/5` : "-/5"}
              thumbnail={livro.capa}
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
    backgroundColor: "#D4AA94",
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

// src/app/(tabs)/home.tsx
import { CarrosselLivros } from "@/components/CarrosselLivros";
import { Header } from "@/components/Header";
import { SearchBar } from "@/components/SearchBar";
import { HomeController } from "@/controllers/homeController";
import { useProtectedRoute } from "@/hook/useProtectedRoute";
import { ILivro } from "@/models/LivroModel";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";

/**
 * Componente principal da Tela Home (Aba principal do aplicativo).
 * Responsável por exibir o feed de recomendações, melhores do mês e as
 * atividades dos amigos. Atua apenas como a camada visual (View),
 * delegando a busca de dados para a `HomeController`.
 */
export default function Home() {
  // Proteção de rota: Garante que apenas usuários logados acessem a Home
  const { user, loading } = useProtectedRoute();

  const router = useRouter();

  // ==========================================
  // ESTADOS (STATES) DA TELA
  // ==========================================

  // Armazena o texto que o usuário digita na barra de pesquisa superior
  const [textoHome, setTextoHome] = useState("");

  // Armazena a lista oficial de livros. Graças ao TypeScript e à nossa POO,
  // o React sabe que aqui dentro só existem objetos seguros do tipo 'ILivro'.
  const [livrosBanco, setLivrosBanco] = useState<ILivro[]>([]);

  // Controle de interface: Mostra o "spinner" enquanto os livros estão sendo baixados da API
  const [carregando, setCarregando] = useState(true);

  // ==========================================
  // EFEITOS (USE EFFECT)
  // ==========================================

  /**
   * Gatilho inicial: É disparado assim que a tela carrega e a verificação
   * de login (loading) é concluída.
   */
  useEffect(() => {
    const buscarLivros = async () => {
      try {
        // A TELA "BURRA": A Home não sabe qual a URL da API ou como limpar os dados.
        // Ela simplesmente pede à Controller e aguarda a lista de livros perfeitos.
        const data = await HomeController.buscarLivrosEmAlta();
        setLivrosBanco(data);
      } catch (error) {
        console.error("Erro ao buscar livros para a Home:", error);
      } finally {
        // Independente de dar certo ou errado, desliga o ícone de carregamento
        setCarregando(false);
      }
    };

    // Só busca os livros na API depois que o Firebase confirmar que o usuário está logado
    if (!loading) {
      buscarLivros();
    }
  }, [loading]);

  // Se a autenticação ainda estiver sendo validada, retorna nulo para não piscar a tela
  if (loading) return null;

  // ==========================================
  // RENDERIZAÇÃO VISUAL (JSX)
  // ==========================================
  return (
    <SafeAreaView style={styles.safeArea}>
      {/* ScrollView: Permite rolar a tela para cima/baixo, garantindo que o 
          conteúdo não seja cortado em celulares com telas menores. */}
      <ScrollView
        style={styles.mainContent}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false} // Esconde a barra lateral do Android/iOS
      >
        <View>
          <Header />
          <View style={styles.searchSection}>
            <SearchBar
              mostrarBotaoLocalizacao={true}
              placeholderText="booklog"
              value={textoHome}
              onChangeText={setTextoHome}
              // Ao apertar "Enter/Buscar" no teclado, redireciona o usuário para
              // a Tela de Pesquisa passando o texto digitado como parâmetro na URL
              onSubmitEditing={() => router.push(`/pesquisa?q=${textoHome}`)}
            />
          </View>
        </View>

        {/* Renderização Condicional: Se está baixando, mostra o loading. Se terminou, mostra as prateleiras */}
        {carregando ? (
          <ActivityIndicator
            size="large"
            color="#500903"
            style={{ marginTop: 50 }}
          />
        ) : (
          <View style={styles.carrosselContainer}>
            <CarrosselLivros
              titulo="Recomendações"
              // Envia apenas os primeiros 9 livros para não pesar a memória
              dados={livrosBanco.slice(0, 9)}
              mostrarBolinhas={false}
            />
            <CarrosselLivros
              titulo="Melhores do mês"
              dados={livrosBanco.slice(0, 9)}
              mostrarBolinhas={false}
            />
            <CarrosselLivros
              titulo="Feed amigos"
              dados={livrosBanco.slice(0, 9)}
              variante="feed" // Variante que muda o layout interno do Card para mostrar o "Usuário"
              mostrarBolinhas={false}
            />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

// ==========================================
// ESTILOS DA TELA (STYLESHEET)
// ==========================================
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#D4AA94",
  },
  mainContent: {
    flex: 1,
    paddingHorizontal: 22,
    paddingTop: 10,
  },
  scrollContent: {
    // Respiro extra no fim da rolagem para os últimos itens não encostarem no menu inferior (Tab Bar)
    paddingBottom: 40,
  },
  searchSection: {
    marginTop: 8,
    marginBottom: 20,
  },
  carrosselContainer: {
    gap: 16, // Espaçamento uniforme vertical entre as diferentes prateleiras
  },
});

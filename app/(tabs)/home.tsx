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

export default function Home() {
  const { user, loading } = useProtectedRoute();
  const router = useRouter();
  const [textoHome, setTextoHome] = useState("");

  const [livrosBanco, setLivrosBanco] = useState<ILivro[]>([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const buscarLivros = async () => {
      try {
        const data = await HomeController.buscarLivrosEmAlta();
        setLivrosBanco(data);
      } catch (error) {
        console.error("Erro ao buscar livros para a Home:", error);
      } finally {
        setCarregando(false);
      }
    };

    if (!loading) {
      buscarLivros();
    }
  }, [loading]);

  if (loading) return null;

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Trocamos a View por ScrollView */}
      <ScrollView
        style={styles.mainContent}
        contentContainerStyle={styles.scrollContent} // Estilo de quem está dentro
        showsVerticalScrollIndicator={false} // Esconde a barra de rolagem feia do lado
      >
        <View>
          <Header />
          <View style={styles.searchSection}>
            <SearchBar
              mostrarBotaoLocalizacao={true}
              placeholderText="booklog"
              value={textoHome}
              onChangeText={setTextoHome}
              onSubmitEditing={() => router.push(`/pesquisa?q=${textoHome}`)}
            />
          </View>
        </View>

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
              variante="feed"
              mostrarBolinhas={false}
            />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

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
    paddingBottom: 40, // Adiciona um respiro no final para o último carrossel não encostar no menu
  },
  searchSection: {
    marginTop: 8,
    marginBottom: 20, // Afastamos um pouco a barra de pesquisa do primeiro carrossel
  },
  carrosselContainer: {
    gap: 16, // Cria um espaçamento uniforme entre os 3 carrosséis (se sua versão do RN for mais antiga e não suportar gap, me avise!)
  },
});

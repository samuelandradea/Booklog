import { CarrosselLivros } from "@/components/CarrosselLivros";
import { Header } from "@/components/Header";
import { SearchBar } from "@/components/SearchBar";
import { useProtectedRoute } from "@/hook/useProtectedRoute";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  SafeAreaView,
  StyleSheet,
  View,
} from "react-native";

export default function Home() {
  const { user, loading } = useProtectedRoute()

  if (loading) return null
  const router = useRouter();
  const [textoHome, setTextoHome] = useState("");

  const [livrosBanco, setLivrosBanco] = useState([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const buscarLivros = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/books");
        const data = await response.json();
        setLivrosBanco(data);
      } catch (error) {
        console.error("Erro ao buscar livros para a Home:", error);
      } finally {
        setCarregando(false);
      }
    };

    buscarLivros();
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.mainContent}>
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
          <ActivityIndicator size="large" color="#500903" style={{ flex: 1 }} />
        ) : (
          <>
            <CarrosselLivros
              titulo="Recomendações"
              dados={livrosBanco.slice(0, 9)}
              mostrarBolinhas={true}
            />
            <CarrosselLivros
              titulo="Melhores do mês"
              dados={livrosBanco.slice(0, 9)}
              mostrarBolinhas={true}
            />
            <CarrosselLivros
              titulo="Feed amigos"
              dados={livrosBanco.slice(0, 9)}
              variante="feed"
              mostrarBolinhas={false}
            />
          </>
        )}
      </View>
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
    paddingBottom: 4,
    justifyContent: "space-between",
  },
  searchSection: {
    marginTop: 8,
    marginBottom: 0,
  },
}); 
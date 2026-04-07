import { CarrosselLivros } from "@/components/CarrosselLivros";
import { SearchBar } from "@/components/SearchBar";
import { Header } from "@/components/Header"; // IMPORTANDO O NOVO COMPONENTE
import { useRouter } from "expo-router";
import { useState } from "react";
import { SafeAreaView, StyleSheet, View } from "react-native";

// Teste para a visualização dos cards
const livrosPadrao = [
  { id: "1", nome: "O Hobbit", nota: "4.5/5" },
  { id: "2", nome: "1984", nota: "5/5" },
  { id: "3", nome: "Duna", nota: "4.8/5" },
  { id: "4", nome: "A Fundação", nota: "4/5" },
  { id: "5", nome: "O Hobbit", nota: "4.5/5" },
  { id: "6", nome: "1984", nota: "5/5" },
  { id: "7", nome: "Duna", nota: "4.8/5" },
  { id: "8", nome: "A Fundação", nota: "4/5" },
  { id: "9", nome: "A Fundação", nota: "4/5" },
];

const livrosFeed = [
  { id: "1", nome: "O Iluminado", nota: "8/10", usuario: "user1" },
  { id: "2", nome: "Drácula", nota: "7/10", usuario: "user2" },
  { id: "3", nome: "Frankenstein", nota: "10/10", usuario: "user3" },
  { id: "4", nome: "O Iluminado", nota: "8/10", usuario: "user1" },
  { id: "5", nome: "Drácula", nota: "7/10", usuario: "user2" },
  { id: "6", nome: "Frankenstein", nota: "10/10", usuario: "user3" },
  { id: "7", nome: "O Iluminado", nota: "8/10", usuario: "user1" },
  { id: "8", nome: "Drácula", nota: "7/10", usuario: "user2" },
  { id: "9", nome: "Frankenstein", nota: "10/10", usuario: "user3" },
];

export default function Home() {
  const router = useRouter();
  const [textoHome, setTextoHome] = useState("");

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.mainContent}>
        <View>
          {/* USANDO O COMPONENTE AQUI */}
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

        <CarrosselLivros
          titulo="Recomendações"
          dados={livrosPadrao}
          mostrarBolinhas={true}
        />
        <CarrosselLivros
          titulo="Melhores do mês"
          dados={livrosPadrao}
          mostrarBolinhas={true}
        />
        <CarrosselLivros
          titulo="Feed amigos"
          dados={livrosFeed}
          variante="feed"
          mostrarBolinhas={false}
        />
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

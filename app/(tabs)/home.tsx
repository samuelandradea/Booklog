import { CarrosselLivros } from "@/components/CarrosselLivros";
import { SearchBar } from "@/components/SearchBar";
import { Feather } from "@expo/vector-icons";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

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
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.mainContent}>
        <View>
          <Text style={styles.logo}>booklog</Text>
          <View style={styles.searchSection}>
            <SearchBar
              mostrarBotaoLocalizacao={true}
              placeholderText="booklog"
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

      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.navButton} activeOpacity={0.7}>
          <Feather name="list" size={24} color="#6F1D1B" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton} activeOpacity={0.7}>
          <Feather name="users" size={24} color="#6F1D1B" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton} activeOpacity={0.7}>
          <Feather name="plus" size={24} color="#6F1D1B" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton} activeOpacity={0.7}>
          <Feather name="award" size={24} color="#6F1D1B" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton} activeOpacity={0.7}>
          <Feather name="user" size={24} color="#6F1D1B" />
        </TouchableOpacity>
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
  logo: {
    fontFamily: "Poppins_700Bold",
    fontSize: 20,
    color: "#500903",
  },
  searchSection: {
    marginTop: 8,
    marginBottom: 0,
  },
  bottomBar: {
    height: 40,
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    width: "100%",
  },
  navButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
});

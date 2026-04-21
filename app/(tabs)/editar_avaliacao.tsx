import { Header } from "@/components/Header";
import { useProtectedRoute } from "@/hook/useProtectedRoute";
import { useLocalSearchParams, router } from "expo-router";
import { api } from "@/lib/api";
import { auth } from "@/lib/firebase";
import { LeituraController } from "@/controllers/leituraController";
import { useState } from "react";
import Slider from "@react-native-community/slider";
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

export default function EditarAvaliacao() {
  const { loading } = useProtectedRoute();
  const { id, nomeLivro, nomeAutor, nota, resenha, thumbnail } =
    useLocalSearchParams();

  const [notaEdit, setNotaEdit] = useState(Number(nota));
  const [resenhaEdit, setResenhaEdit] = useState(resenha as string);

  if (loading) return null;

  const thumbnailSegura = thumbnail
    ? (thumbnail as string).replace("http:", "https:")
    : null;

  const salvarEdicao = async () => {
    const sucesso = await LeituraController.editarReview(id as string, {
      nota: notaEdit,
      resenha: resenhaEdit,
    });
    if (sucesso) {
      Alert.alert("Sucesso", "Avaliação atualizada!");
      router.push("/(tabs)/lidos_recente");
    }
  };

  const sairSemSalvar = () => {
    Alert.alert("Sair sem salvar", "Tem certeza que deseja sair sem salvar?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Sair",
        style: "destructive",
        onPress: () => router.push("/(tabs)/lidos_recente"),
      },
    ]);
  };

  const deletarReview = async () => {
    const uid = auth.currentUser?.uid;
    Alert.alert("Deletar", "Tem certeza que deseja deletar esta avaliação?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Deletar",
        style: "destructive",
        onPress: async () => {
          const sucesso = await LeituraController.deletarReview(
            uid!,
            id as string,
          );
          if (sucesso) {
            Alert.alert("Sucesso", "Avaliação deletada!");
            router.push("/(tabs)/lidos_recente");
          }
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <ScrollView contentContainerStyle={styles.content}>
        <Header />

        <View style={styles.topoContainer}>
          <View style={styles.capa}>
            {thumbnailSegura ? (
              <Image
                source={{ uri: thumbnailSegura }}
                style={styles.capaImagem}
              />
            ) : (
              <Text style={styles.capaTexto}>Livro</Text>
            )}
          </View>
          <View style={styles.infoContainer}>
            <Text style={styles.nomeLivro}>{nomeLivro}</Text>
            <Text style={styles.nomeAutor}>{nomeAutor}</Text>
          </View>
        </View>

        <Text style={styles.label}>Nota: {notaEdit.toFixed(1)}/5</Text>
        <Slider
          minimumValue={0}
          maximumValue={5}
          step={0.5}
          value={notaEdit}
          onValueChange={setNotaEdit}
          minimumTrackTintColor="#6F1D1B"
          maximumTrackTintColor="#ccc"
          thumbTintColor="#6F1D1B"
          style={{ marginBottom: 20 }}
        />

        <Text style={styles.label}>Resenha:</Text>
        <TextInput
          style={styles.resenhaInput}
          multiline
          value={resenhaEdit}
          onChangeText={setResenhaEdit}
          placeholder="Escreva sua resenha..."
        />

        <TouchableOpacity style={styles.botaoSalvar} onPress={salvarEdicao}>
          <Text style={styles.botaoTexto}>Salvar e sair</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.botaoSairSemSalvar}
          onPress={sairSemSalvar}
        >
          <Text style={styles.botaoTexto}>Sair sem salvar</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.botaoDeletar} onPress={deletarReview}>
          <Text style={styles.botaoTexto}>Deletar avaliação</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#D4AA94",
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  topoContainer: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 20,
  },
  capa: {
    width: 100,
    height: 140,
    backgroundColor: "#6F1D1B",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  capaImagem: {
    width: 100,
    height: 140,
    borderRadius: 12,
  },
  capaTexto: {
    color: "#D4AA94",
    fontSize: 16,
    fontWeight: "bold",
  },
  infoContainer: {
    flex: 1,
    justifyContent: "center",
  },
  nomeLivro: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#500903",
    fontFamily: "Poppins_700Bold",
  },
  nomeAutor: {
    fontSize: 13,
    color: "#6F1D1B",
    marginTop: 4,
  },
  label: {
    fontFamily: "Poppins_700Bold",
    color: "#500903",
    marginBottom: 8,
    fontSize: 16,
  },
  resenhaInput: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 12,
    height: 150,
    textAlignVertical: "top",
    marginBottom: 20,
  },
  botaoSalvar: {
    backgroundColor: "#6F1D1B",
    padding: 16,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 12,
  },
  botaoSairSemSalvar: {
    backgroundColor: "#C4906A",
    padding: 16,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 12,
  },
  botaoDeletar: {
    backgroundColor: "#500903",
    padding: 16,
    borderRadius: 10,
    alignItems: "center",
  },
  botaoTexto: {
    color: "#fff",
    fontFamily: "Poppins_700Bold",
    fontSize: 16,
  },
});

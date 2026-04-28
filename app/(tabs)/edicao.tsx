import { Header } from "@/components/Header";
import { useProtectedRoute } from "@/hook/useProtectedRoute";
import { useLocalSearchParams, router } from "expo-router";
import { Button } from "@/components/Button";
import { LeituraController } from "@/controllers/leituraController";
import { useState, useEffect } from "react";
import Slider from "@react-native-community/slider";
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

export default function EditarAvaliacao() {
  const { user, loading } = useProtectedRoute();

  const controller = new LeituraController();

  const { id, nomeLivro, nomeAutor, nota, resenha, thumbnail } =
    useLocalSearchParams();

  const [notaEdit, setNotaEdit] = useState(Number(nota));
  const [resenhaEdit, setResenhaEdit] = useState(resenha as string);

  useEffect(() => {
    setNotaEdit(Number(nota));
    setResenhaEdit(resenha as string);
  }, [id]);

  if (loading) return null;

  const thumbnailSegura = thumbnail
    ? (thumbnail as string).replace("http:", "https:")
    : null;

  const salvarEdicao = async () => {
    try {
      const sucesso = await controller.editarReview(id as string, {
        nota: notaEdit,
        resenha: resenhaEdit,
      });

      if (sucesso) {
        Alert.alert("Sucesso", "Avaliação atualizada!");
        router.push("/(tabs)/lidos_recente");
      }
    } catch (error: any) {
      Alert.alert(error.message);
    }
  };

  const deletarReview = async () => {
    const uid = user?.uid;

    if (!uid) return;

    Alert.alert("Deletar", "Tem certeza que deseja deletar esta avaliação?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Deletar",
        style: "destructive",
        onPress: async () => {
          try {
            const sucesso = await controller.deletarReview(uid, id as string);

            if (sucesso) {
              Alert.alert("Sucesso", "Avaliação deletada!");
              router.push("/(tabs)/lidos_recente");
            }
          } catch (error: any) {
            Alert.alert(error.message);
          }
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <ScrollView contentContainerStyle={styles.content}>
        <Header onPressLogo={() => Alert.alert(
          'Sair da edição',
          'O que deseja fazer?',
          [
            { text: 'Cancelar', style: 'cancel' },
            { text: 'Sair sem salvar', style: 'destructive', onPress: () => router.push('/(tabs)/lidos_recente') },
            { text: 'Salvar e sair', onPress: salvarEdicao },
          ]
        )} />

        <View style={styles.capaContainer}>
          <View style={styles.capa}>
            {thumbnailSegura ? (
              <Image
                source={{ uri: thumbnailSegura }}
                style={styles.capaImagem}
              />
            ) : (
              <View style={styles.capaPlaceholder}>
                <Ionicons name="book-outline" size={48} color="#D4AA94" />
              </View>
            )}
          </View>
          <Text style={styles.nomeLivro}>
            {nomeLivro}
          </Text>
          <Text style={styles.nomeAutor}>
            {nomeAutor}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>
            Nota do livro:
          </Text>
          <View style={styles.notaBadge}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              {[1, 2, 3, 4, 5].map((estrela) => (
                <Ionicons key={estrela} name={notaEdit >= estrela ? "star" : "star-outline"} size={16} color="#FFD700" />
              ))}
              <Text style={styles.notaTexto}> 
                {notaEdit.toFixed(1)}
              </Text>
            </View>
          </View>
          <Slider minimumValue={0} maximumValue={5} step={0.5} value={notaEdit} onValueChange={setNotaEdit} minimumTrackTintColor="#6F1D1B" maximumTrackTintColor="#ccc" thumbTintColor="#6F1D1B" />
        </View> 

        <View style={styles.section}>
          <Text style={styles.label}>
            Resenha:
          </Text>
          <TextInput
            style={styles.resenhaInput}
            multiline
            value={resenhaEdit}
            onChangeText={setResenhaEdit}
            placeholder="Escreva sua resenha..."
            placeholderTextColor="#FFFFFF"
          />
        </View>

       <View style={styles.botoesContainer}>
        <Button 
          label="Salvar" 
          style={styles.botaoSalvar} 
          onPress={salvarEdicao} 
        />
        <Button  
          label="Deletar" 
          style={styles.botaoDeletar} 
          onPress={deletarReview} 
        />
       </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#D4AA94",
  },
  section: {
    marginBottom: 20,
  },
  container: {
    flex: 1
  },
  content: {
    padding: 20
  },
   capaContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  capa: {
    width: 180,
    height: 260,
    backgroundColor: "#6F1D1B",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  capaPlaceholder: {
    width: 180, 
    height: 260, 
    backgroundColor: '#6F1D1B', 
    borderRadius: 12, 
    justifyContent: 'center', 
    alignItems: 'center',
  },
  capaImagem: {
    width: 180,
    height: 260,
    borderRadius: 12,
  },
  nomeLivro: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#500903",
    fontFamily: "Poppins_700Bold",
  },
  nomeAutor: {
    fontSize: 14,
    color: "#6F1D1B",
  },
  label: {
    color: "#500903",
    fontWeight: "bold",
    marginBottom: 8,
    fontSize: 18,
  },
   notaBadge: { 
    backgroundColor: '#6F1D1B', 
    paddingHorizontal: 16, 
    paddingVertical: 8,
    borderRadius: 8, 
    alignSelf: 'flex-start', 
    marginBottom: 8 
  },
  notaTexto: { 
    color: '#D4AA94', 
    fontWeight: 'bold', 
    fontSize: 16 
  },
  resenhaInput: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 12,
    height: 150,
    textAlignVertical: "top",
    color: '#500903',
  },
  botoesContainer: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    gap: 12, 
    marginBottom: 22 
  },
  botaoSalvar: {
    flex: 1,
    backgroundColor: "#6F1D1B",
    padding: 8,
    borderRadius: 10,
    alignItems: "center",
    height: 50,
  },
  botaoDeletar: {
    flex: 1,
    backgroundColor: "#500903",
    padding: 8,
    borderRadius: 10,
    alignItems: "center",
    height: 50,
  },
});

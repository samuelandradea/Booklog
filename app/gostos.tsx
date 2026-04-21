// Importação de componentes reutilizáveis da interface
import { Button } from "@/components/Button";
import { Divider } from "@/components/Divider";
// Importação do controller responsável pela lógica de perfil (POO)
import { PerfilController } from "@/controllers/perfilController";
// Hook de autenticação para acessar o usuário logado
import { useAuth } from "@/context/authContext";
import { router } from "expo-router";
import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";

// Lista fixa de gêneros literários disponíveis para o usuário selecionar
const genres = [
  "Ficção",
  "Crítica Literária", 
  "Comics & HQs",
  "Biografia e autobiografia",
  "Filosofia",
  "Ficção juvenil",
  "Ciências",
  "Drama",
  "História",
  "Poesia",
  "Não-ficção juvenil",
  "Religião",
];

// Instância do controller (camada de lógica da aplicação)
const controller = new PerfilController();

export default function Gostos() {

  // Obtém o usuário autenticado
  const { user } = useAuth();

  const { width } = useWindowDimensions();

  // Define a largura dos botões dinamicamente
  const buttonWidth = (width - 32 - 32 - 16) / 3;

  // Estado que armazena os gêneros selecionados pelo usuário
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);

  // Função chamada ao confirmar seleção de gêneros
  async function handleConfirm() {
    try {
      // Chama o controller (regra de negócio) para salvar os dados
      await controller.salvarGeneros(user?.uid, selectedGenres);

      router.replace("/(tabs)/home");

    } catch (error: any) {
      Alert.alert(error.message);
    }
  }

  // Função para adicionar/remover um gênero da lista (toggle)
  function handleSelectGenre(genre: string) {

    // Verifica se o gênero já está selecionado
    if (selectedGenres.includes(genre)) {

      // Remove o gênero da lista
      setSelectedGenres((prev) =>
        prev.filter((genres) => genres !== genre)
      );

    } else {

      // Adiciona o gênero à lista
      setSelectedGenres((prev) => [...prev, genre]);
    }
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.select({ ios: "padding", android: "height" })}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.container}>

          <Text style={styles.title}>Gêneros favoritos</Text>

          <Divider />

          <Text style={styles.subtitle}>
            Selecione os gêneros que você mais gosta
          </Text>

          <Divider />

          {/* Lista de botões de gêneros */}
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>

            {genres.map((genre) => (

              <TouchableOpacity
                key={genre}

                // Estilo muda conforme seleção
                style={[
                  selectedGenres.includes(genre)
                    ? styles.selecionado
                    : styles.normal,
                  { width: buttonWidth },
                ]}

                // Ao clicar, adiciona/remove gênero
                onPress={() => handleSelectGenre(genre)}
              >

                <Text
                  style={
                    selectedGenres.includes(genre)
                      ? styles.textoSelecionado
                      : styles.textoNormal
                  }
                >
                  {genre}
                </Text>

              </TouchableOpacity>
            ))}

          </View>

          {/* Botão de confirmação */}
          <View style={{ alignItems: "center", marginTop: 24 }}>
            <Button label="Confirmar" onPress={handleConfirm} />

          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  title: {
    fontFamily: "Poppins_700Bold",
    fontSize: 28,
    color: "#500903",
    textAlign: "center",
    marginBottom: 20,
  },
  subtitle: {
    fontFamily: "Poppins_700Bold",
    fontSize: 19,
    color: "#500903",
    textAlign: "center",
    marginBottom: 20,
  },

  // Estilo padrão dos botões de gênero
  normal: {
    paddingVertical: 8,
    paddingHorizontal: 4,
    height: 48,
    borderWidth: 1,
    borderColor: "#6F1D1B",
    borderRadius: 7,
    justifyContent: "center",
    alignItems: "center",
  },
  selecionado: {
    paddingVertical: 8,
    paddingHorizontal: 4,
    height: 48,
    backgroundColor: "#6F1D1B",
    borderWidth: 1,
    borderColor: "#FFFFFF",
    borderRadius: 7,
    justifyContent: "center",
    alignItems: "center",
  },
  // Container principal da tela
  container: {
    flex: 1,
    backgroundColor: "#D4AA94",
    padding: 28,
    paddingTop: 60,
  },
  textoNormal: {
    fontFamily: "RedHatDisplay_500Medium",
    color: "#6F1D1B",
    textAlign: "center",
    fontSize: 14,
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  textoSelecionado: {
    fontFamily: "RedHatDisplay_500Medium",
    color: "#FFFFFF",
    textAlign: "center",
    fontSize: 14,
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
});
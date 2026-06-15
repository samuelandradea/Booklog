import { BackButton } from "@/components/BackButton";
import { MapaController } from "@/controllers/mapaController";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState, useRef } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function SugerirLocal() {
  const router = useRouter();

  const [nome, setNome] = useState("");
  const [categoria, setCategoria] = useState("Livraria");
  const [endereco, setEndereco] = useState("");
  const [motivo, setMotivo] = useState("");
  const [enviando, setEnviando] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const categorias = ["Livraria", "Biblioteca", "Café", "Parque", "Outro"];

  const handleSubmit = async () => {
    if (!nome || !endereco) {
      Alert.alert(
        "Campos obrigatórios",
        "Por favor, preencha o nome e o endereço do local.",
      );
      return;
    }

    setEnviando(true);

    // Faz o fetch real para o backend Python
    const sucesso = await MapaController.enviarSugestao({
      nome,
      categoria,
      endereco,
      motivo,
    });

    setEnviando(false);

    if (sucesso) {
      // Limpa os campos por garantia
      setNome("");
      setEndereco("");
      setMotivo("");
      setCategoria("Livraria");

      // Na web, o Alert.alert do react-native às vezes não dispara o onPress do botão OK.
      // Por isso fazemos o tratamento separadamente.
      if (Platform.OS === "web") {
        window.alert(
          "Sucesso! Sua sugestão foi enviada para nossa equipe avaliar. Obrigado por contribuir com o Booklog!",
        );
        router.back(); // Volta para o mapa
      } else {
        Alert.alert(
          "Sucesso!",
          "Sua sugestão foi enviada para nossa equipe avaliar. Obrigado por contribuir com o Booklog!",
          [{ text: "OK", onPress: () => router.back() }],
        );
      }
    } else {
      if (Platform.OS === "web") {
        window.alert(
          "Erro: Ocorreu um problema ao enviar a sugestão. Tente novamente mais tarde.",
        );
      } else {
        Alert.alert(
          "Erro",
          "Ocorreu um problema ao enviar a sugestão. Tente novamente mais tarde.",
        );
      }
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.select({ ios: "padding", android: "height" })}
    >
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        ref={scrollViewRef}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={[styles.scrollContent, { paddingBottom: 25 }]}
      >
        {/* BOTÃO VOLTAR */}
        <View style={styles.headerContainer}>
          <BackButton />
        </View>

        <View style={styles.titleContainer}>
          <Text style={styles.title}>Sugerir Local</Text>
          <Text style={styles.subtitle}>
            Conhece um lugar incrível para leitores? Envie para nós! Nossa
            equipe vai avaliar em breve.
          </Text>
          <View style={styles.divider} />
        </View>

        {/* FORMULÁRIO */}
        <View style={styles.formContainer}>
          <TextInput
            style={styles.inputCard}
            placeholder="Nome do Local"
            placeholderTextColor="#500903"
            value={nome}
            onChangeText={setNome}
          />

          <Text style={styles.sectionLabel}>Categoria:</Text>
          <View style={styles.pillsContainer}>
            {categorias.map((cat) => (
              <TouchableOpacity
                key={cat}
                style={[styles.pill, categoria === cat && styles.pillActive]}
                onPress={() => setCategoria(cat)}
              >
                {/* Simulando o Radio Button conforme o Figma, mas com cara de botão clicável */}
                <View style={styles.radioOuter}>
                  {categoria === cat && <View style={styles.radioInner} />}
                </View>
                <Text style={styles.pillText}>{cat}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.sectionLabel}>Endereço:</Text>
          <View
            style={[
              styles.inputCard,
              { flexDirection: "row", alignItems: "center" },
            ]}
          >
            <Feather
              name="search"
              size={18}
              color="#500903"
              style={{ marginRight: 8 }}
            />
            <TextInput
              style={{ flex: 1, color: "#500903", fontWeight: "bold" }}
              placeholder="Digite a rua, bairro ou nome do local..."
              placeholderTextColor="#500903"
              value={endereco}
              onChangeText={setEndereco}
            />
          </View>

          <Text style={styles.sectionLabel}>
            Por que este local é especial? (Opcional)
          </Text>
          <TextInput
            style={[styles.inputCard, styles.textArea]}
            placeholder="Conte-nos sobre este lugar..."
            placeholderTextColor="rgba(80, 9, 3, 0.5)"
            multiline={true}
            numberOfLines={4}
            value={motivo}
            onChangeText={setMotivo}
            textAlignVertical="top"
            onFocus={() => {
              setTimeout(() => {
                scrollViewRef.current?.scrollToEnd({ animated: true})
              }, 100);
            }}
          />

          {/* BOTÃO ENVIAR */}
          <TouchableOpacity
            style={styles.submitButton}
            activeOpacity={0.8}
            onPress={handleSubmit}
            disabled={enviando}
          >
            {enviando ? (
              <Text style={styles.submitText}>ENVIANDO...</Text>
            ) : (
              <Text style={styles.submitText}>ENVIAR SUGESTÃO</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#D4AA94",
  },
  scrollContent: {
    paddingBottom: 40,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    marginTop: 15, // Dá um pequeno respiro no topo
  },
  titleContainer: {
    alignItems: "center",
    paddingHorizontal: 20,
    marginTop: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#500903",
  },
  subtitle: {
    fontSize: 10,
    color: "#500903",
    textAlign: "center",
    marginTop: 5,
  },
  divider: {
    height: 1,
    width: "100%",
    backgroundColor: "rgba(80, 9, 3, 0.3)",
    marginTop: 10,
  },
  formContainer: {
    paddingHorizontal: 22,
    marginTop: 20,
  },
  inputCard: {
    backgroundColor: "rgba(255,255,255,0.6)",
    borderRadius: 10,
    padding: 12,
    color: "#500903",
    fontWeight: "bold",
    marginBottom: 15,
  },
  sectionLabel: {
    color: "#500903",
    fontWeight: "bold",
    fontSize: 14,
    marginBottom: 10,
    marginLeft: 5,
  },
  pillsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 15,
    marginBottom: 20,
    marginLeft: 5,
  },
  pill: {
    flexDirection: "row",
    alignItems: "center",
  },
  pillActive: {
    opacity: 1,
  },
  radioOuter: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 1.5,
    borderColor: "#500903",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 6,
  },
  radioInner: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#500903",
  },
  pillText: {
    color: "#500903",
    fontSize: 12,
    fontWeight: "bold",
  },

  textArea: {
    height: 100,
  },
  submitButton: {
    backgroundColor: "#500903",
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: "center",
    marginTop: 10,
  },
  submitText: {
    color: "#FFF",
    fontWeight: "bold",
    letterSpacing: 1,
  },
});

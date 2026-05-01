import { Button } from "@/components/Button";
import { Divider } from "../src/components/Divider";
import { Input } from "@/components/Input";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
} from "react-native";

// Tela responsável pela verificação do código de recuperação enviado por email
export default function CodigoRecuperacao() {
  const { email } = useLocalSearchParams();
  const [codigo, setCodigo] = useState("");

  const handleContinuar = () => {
    if (!codigo.trim()) {
      Alert.alert("Atenção", "Por favor, informe o código recebido.");
      return;
    }
    // Navega para a tela de redefinição de senha
    router.push({ pathname: "/redefinir_senha", params: { email, codigo } });
  };

  const handleReenviar = async () => {
    if (!codigo.trim()) {
      Alert.alert(
        "Código reenviado",
        "Um novo código foi enviado para o seu email.",
      );
      return;
    }
    try {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/recovery/verify-code`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, codigo }),
        },
      );
      const data = await response.json();
      if (response.ok) {
        router.push({
          pathname: "/redefinir_senha" as any,
          params: { email, codigo },
        });
      } else {
        Alert.alert("Erro", data.detail || "Código inválido.");
      }
    } catch (error) {
      Alert.alert("Erro", "Não foi possível conectar ao servidor.");
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.select({ ios: "padding", android: "height" })}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        style={styles.scroll}
      >
        <Text style={styles.titulo}>
          Digite o código enviado para{"\n"}o seu email :
        </Text>

        <Input
          style={styles.input}
          placeholder="Código:"
          value={codigo}
          onChangeText={setCodigo}
          keyboardType="number-pad"
        />

        <Button
          label="Continuar"
          style={styles.botao}
          onPress={handleContinuar}
        />

        <Text style={styles.link} onPress={handleReenviar}>
          Reenviar código
        </Text>

        <Divider />

        <Text style={styles.linkVoltar} onPress={() => router.back()}>
          Voltar
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scroll: { backgroundColor: "#D4AA94" },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    gap: 16,
  },
  titulo: {
    fontFamily: "Poppins_700Bold",
    fontSize: 22,
    color: "#500903",
    textAlign: "center",
    marginBottom: 16,
  },
  input: {
    width: "100%",
    backgroundColor: "#6F1D1B",
    borderRadius: 10,
    color: "#fff",
  },
  botao: {
    width: "60%",
    borderRadius: 24,
    backgroundColor: "#6F1D1B",
  },
  link: {
    fontFamily: "RedHatDisplay_500Medium",
    color: "#500903",
    fontSize: 14,
    marginTop: 4,
  },
  linkVoltar: {
    fontFamily: "RedHatDisplay_500Medium",
    color: "#500903",
    fontSize: 14,
    marginTop: 16,
    opacity: 0.7,
  },
});

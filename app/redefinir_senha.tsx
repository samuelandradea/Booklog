import { Button } from "@/components/Button";
import { Divider } from "../src/components/Divider";
import { Input } from "@/components/Input";
import { FooterLink } from "@/components/Footerlink";
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

// Tela responsável pela redefinição de senha do usuário
// Valida os requisitos mínimos de segurança antes de salvar
export default function RedefinirSenha() {
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmacao, setConfirmacao] = useState("");
  const { email, codigo } = useLocalSearchParams();

  // Valida se a senha atende aos requisitos mínimos de segurança
  const senhaValida = (senha: string) => {
    const temOito = senha.length >= 8;
    const temMaiuscula = /[A-Z]/.test(senha);
    const temMinuscula = /[a-z]/.test(senha);
    const temNumero = /[0-9]/.test(senha);
    return temOito && temMaiuscula && temMinuscula && temNumero;
  };

  const handleEnviar = async () => {
    if (!novaSenha.trim() || !confirmacao.trim()) {
      Alert.alert("Atenção", "Por favor, preencha todos os campos.");
      return;
    }
    if (!senhaValida(novaSenha)) {
      Alert.alert(
        "Senha inválida",
        "A senha não atende aos requisitos mínimos.",
      );
      return;
    }
    if (novaSenha !== confirmacao) {
      Alert.alert("Erro", "As senhas não coincidem.");
      return;
    }
    try {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/recovery/reset-password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, codigo, nova_senha: novaSenha }),
        },
      );
      const data = await response.json();
      if (response.ok) {
        Alert.alert("Sucesso", "Senha redefinida com sucesso!", [
          { text: "OK", onPress: () => router.replace("/" as any) },
        ]);
      } else {
        Alert.alert("Erro", data.detail || "Erro ao redefinir senha.");
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
        <Text style={styles.titulo}>Digite sua nova senha:</Text>

        <Input
          style={styles.input}
          placeholder="Nova senha:"
          value={novaSenha}
          onChangeText={setNovaSenha}
          secureTextEntry
        />

        <Input
          style={styles.input}
          placeholder="Confirmação da senha:"
          value={confirmacao}
          onChangeText={setConfirmacao}
          secureTextEntry
        />

        <Text style={styles.requisitos}>
          A senha precisa conter pelo menos:{"\n"}
          Oito caracteres{"\n"}
          Uma letra maiúscula{"\n"}
          Uma letra minúscula{"\n"}
          Um número
        </Text>

        <Button label="Enviar" style={styles.botao} onPress={handleEnviar} />

        <Divider />

        <FooterLink linkLabel="Voltar"href={"/"} />
        
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
  requisitos: {
    fontFamily: "RedHatDisplay_500Medium",
    color: "#500903",
    fontSize: 13,
    alignSelf: "flex-start",
    lineHeight: 22,
  },
  botao: {
    width: "60%",
    borderRadius: 24,
    backgroundColor: "#6F1D1B",
    textAlign: "center",
  },
  linkVoltar: {
    fontFamily: "RedHatDisplay_500Medium",
    color: "#500903",
    fontSize: 14,
    marginTop: 16,
    opacity: 0.7,
  },
});

import { Button } from "@/components/Button";
import { Divider } from "../src/components/Divider";
import { FooterLink } from "@/components/Footerlink";
import { Input } from "@/components/Input";
import { router } from "expo-router";
import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
} from "react-native";

// Tela responsável pela recuperação de conta do usuário
// O usuário informa o email e recebe um código de recuperação
export default function RecuperarConta() {
  const [email, setEmail] = useState("");

  const handleContinuar = () => {
    if (!email.trim()) {
      Alert.alert("Atenção", "Por favor, informe seu email.");
      return;
    }
    // Navega para a tela de código de recuperação passando o email
    router.push({ pathname: "/codigo_recuperacao", params: { email } });
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
          Digite seu email para{"\n"}recuperar a sua conta:
        </Text>

        <Input
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Button
          label="Continuar"
          style={styles.botao}
          onPress={handleContinuar}
        />

        <Divider />
        <FooterLink  text="Possue conta?" linkLabel="Faça seu login!" href={"/"}  />
        <FooterLink text="Não possui uma conta?" linkLabel="Cadastre-se aqui!" href="/cadastro" />
        
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
    padding: 28,
    gap: 10,
  },
  titulo: {
    fontFamily: "Poppins_700Bold",
    fontSize: 22,
    color: "#500903",
    textAlign: "center",
  },
  input: {
    width: "100%",
    backgroundColor: "#6F1D1B",
    borderRadius: 10,
    color: "#fff",
  },
  botao: {
    width: '50%',
    padding: 4,
    borderRadius: 10,
    backgroundColor: "#6F1D1B",
  },
  link: {
    fontFamily: "RedHatDisplay_700Bold",
    color: "#500903",
    fontSize: 16,
    marginTop: 4,
  },
});

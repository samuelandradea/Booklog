import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";

import { CardLivro } from "@/components/CardLivro";
import { Divider } from "@/components/Divider";
import { Header } from "@/components/Header";
import { useProtectedRoute } from "@/hook/useProtectedRoute";

export default function LidosRecente() {
  // Dados mockados temporariamente até integrar com o backend
  const livros = Array.from({ length: 10 }).map((_, i) => ({
    id: String(i),
    nome: "nomeLivro",
    nota: "0/10",
  }));

  // Verifica se o usuário está logado e redireciona para login se não estiver
  const { user, loading } = useProtectedRoute()
  if (loading) return null

  return (
    <KeyboardAvoidingView 
      style={{ flex: 1 }} 
      behavior={Platform.select({ ios: "padding", android: "height"})}
    >
      <ScrollView 
        contentContainerStyle={{ flexGrow: 1 }} 
        style={{ backgroundColor: "#D4AA94" }}
      >
        <View style={styles.container}>

          {/* Cabeçalho global do app (componente reutilizável) */}
          <Header />

          {/* Subheader da tela: botão de voltar + título + divider */}
          <View style={styles.subHeaderContainer}>
            <TouchableOpacity>
              <Ionicons name="chevron-back" size={30} color="#500903" />
            </TouchableOpacity>
            
            <View style={{ flex: 1 }}>
              <Text style={styles.title}>Leituras recentes</Text>
              <Divider />
            </View>
          </View>

          {/* Grade de livros lidos — futuramente virá do backend */}
          <View style={styles.grid}>
            {livros.map((item) => (
              <CardLivro 
                key={item.id}
                nome={item.nome}
                nota={item.nota}
                variante="grid" 
              />
            ))}
          </View>

        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 60,
  },
  // Linha horizontal com botão de voltar e título alinhados
  subHeaderContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 20,
    gap: 5,
  },
  title: {
    fontFamily: "Poppins_700Bold",
    fontSize: 20,
    color: "#500903",
    textAlign: "right", 
  },
  // Grade responsiva de cards de livros
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
  },
  // Estilo reservado para ajuste individual dos cards na grade
  cardAjustado: {
    width: '23%', 
    marginBottom: 20,
    alignItems: "center",
  }
});
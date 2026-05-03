import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

/**
 * Tipagem das propriedades aceitas pelo componente CardPesquisaUsuario.
 */
type Props = {
  /** Nome ou Apelido (Nickname) do usuário retornado na busca. */
  id: string;
  nome: string;
};

/**
 * Componente visual (Dumb Component) que representa um Usuário/Amigo na lista de resultados.
 * * Inclui um ícone circular à esquerda do nome para ajudar a diferenciar visualmente
 * os usuários dos autores na tela mista de resultados.
 */
export function CardPesquisaUsuario({ id, nome }: Props) {
  return (
    <TouchableOpacity style={styles.userButton} 
    activeOpacity={0.7}
    onPress={() => router.push({ pathname: "/perfilAmizade", params: { uid: id } })}
    >
      {/* Círculo decorativo que engloba o ícone do usuário */}
      <View style={styles.userIconCircle}>
        <Feather name="user" size={16} color="#FFF" />
      </View>

      <Text style={styles.userText}>{nome}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  userButton: {
    backgroundColor: "#F2EBE5",
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
  },
  userIconCircle: {
    backgroundColor: "#500903",
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  userText: {
    fontFamily: "Poppins_700Bold",
    color: "#500903",
  },
});

import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";

type Props = { nome: string };

export function CardPesquisaUsuario({ nome }: Props) {
  return (
    <TouchableOpacity style={styles.userButton}>
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
  userText: { fontFamily: "Poppins_700Bold", color: "#500903" },
});

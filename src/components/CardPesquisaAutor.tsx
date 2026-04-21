import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

type Props = { nome: string };

export function CardPesquisaAutor({ nome }: Props) {
  return (
    <TouchableOpacity style={styles.authorButton}>
      <Text style={styles.authorText}>{nome}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  authorButton: {
    backgroundColor: "#F2EBE5",
    padding: 15,
    borderRadius: 8,
    marginBottom: 25,
  },
  authorText: { fontFamily: "Poppins_700Bold", color: "#500903" },
});

import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Feather } from "@expo/vector-icons";

type HeaderProps = {
  // Propriedade opcional. Se ninguém avisar nada, ela começa como "falsa"
  mostrarEngrenagem?: boolean;
};

export function Header({ mostrarEngrenagem = false }: HeaderProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.logo}>booklog</Text>

      {/* A engrenagem só é renderizada na tela se a propriedade for verdadeira */}
      {mostrarEngrenagem && (
        <TouchableOpacity activeOpacity={0.7} style={styles.engrenagemButton}>
          <Feather name="settings" size={24} color="#500903" />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
    minHeight: 32,
  },
  logo: {
    fontFamily: "Poppins_700Bold",
    fontSize: 20,
    color: "#500903",
  },
  engrenagemButton: {
    padding: 4,
  },
});

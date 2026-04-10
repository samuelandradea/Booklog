import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";

type HeaderProps = {
  // Propriedade opcional. Se ninguém avisar nada, ela começa como "falsa"
  mostrarEngrenagem?: boolean;
};

export function Header({ mostrarEngrenagem = false }: HeaderProps) {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/*A logo é um botão clicável que leva para a rota /home */}
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => router.push("/home")}
      >
        <Text style={styles.logo}>booklog</Text>
      </TouchableOpacity>

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

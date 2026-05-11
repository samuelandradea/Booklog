import { Ionicons } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
 
/**
 * Tipagem das propriedades aceitas pelo componente CardAmizade.
 */
type Props = {
  nome: string;
  onPressPrincipal?: () => void;
  onPressAcao?: () => void;
};
 
/**
 * Componente visual (Dumb Component) que representa um amigo na tela de amizades.
 * Exibe avatar, nome do usuário e botão de remoção.
 * Ao pressionar o card navega ao perfil do amigo.
 * Ao pressionar a lixeira remove a amizade.
 */
export function CardAmizade({ nome, onPressPrincipal, onPressAcao }: Props) {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.botaoPrincipal}
        onPress={onPressPrincipal}
        activeOpacity={0.7}
      >
        <View style={styles.avatar}>
          <Ionicons name="person" size={18} color="#f2ebe5" />
        </View>
        <Text style={styles.textoPrincipal}>{nome}</Text>
      </TouchableOpacity>
 
      <TouchableOpacity
        style={styles.botaoAcao}
        onPress={onPressAcao}
        activeOpacity={0.6}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Feather name="trash-2" size={20} color="#500903" />
      </TouchableOpacity>
    </View>
  );
}
 
const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#F2EBE5",
    borderRadius: 8,
    marginBottom: 15,
    padding: 10,
    opacity: 0.8,
  },
  botaoPrincipal: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  avatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#6F1D1B",
    alignItems: "center",
    justifyContent: "center",
  },
  textoPrincipal: {
    fontFamily: "Poppins_700Bold",
    color: "#500903",
    flexShrink: 1,
    fontSize: 17,
  },
  botaoAcao: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginLeft: 10,
  },
});
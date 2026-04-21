import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

/**
 * Propriedades aceitas pelo componente Header.
 */
type HeaderProps = {
  /** * Define se o botão de engrenagem (Configurações) deve aparecer à direita.
   * @default false (Se ninguém avisar nada, ela começa escondida)
   */
  mostrarEngrenagem?: boolean;
};

/**
 * Componente visual de Cabeçalho Global do aplicativo.
 * * Exibe a logo "booklog" que, ao ser clicada, sempre redireciona o usuário
 * de volta para a aba principal (Home). Suporta um botão de configurações opcional.
 */
export function Header({ mostrarEngrenagem = false }: HeaderProps) {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Botão da Logo: Age como um botão de "Início" em qualquer tela do app */}
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => router.navigate("/(tabs)/home")}
      >
        <Text style={styles.logo}>booklog</Text>
      </TouchableOpacity>

      {/* Renderização Condicional: A engrenagem só é desenhada na tela 
          se a tela pai passar `mostrarEngrenagem={true}` */}
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

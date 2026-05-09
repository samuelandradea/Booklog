import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, TouchableOpacity, TouchableOpacityProps } from "react-native";

interface BackButtonProps extends TouchableOpacityProps {
  /** Cor do ícone (Padrão: Vinho Escuro #500903) */
  color?: string;
  /** Tamanho do ícone (Padrão: 28) */
  size?: number;
}

/**
 * Componente reutilizável de Botão Voltar.
 * Ele automaticamente chama a função `router.back()` do Expo Router quando clicado.
 */
export function BackButton({ color = "#500903", size = 28, style, ...rest }: BackButtonProps) {
  const router = useRouter();

  return (
    <TouchableOpacity
      style={[styles.button, style]}
      onPress={() => router.back()}
      activeOpacity={0.7}
      {...rest}
    >
      <Feather name="chevron-left" size={size} color={color} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    // Área de clique amigável
    padding: 4, 
    justifyContent: "center",
    alignItems: "center",
  },
});

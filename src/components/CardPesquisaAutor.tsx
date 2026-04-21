import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

/**
 * Tipagem das propriedades aceitas pelo componente CardPesquisaAutor.
 */
type Props = {
  /** Nome completo do autor retornado pela busca. */
  nome: string;
};

/**
 * Componente visual (Dumb Component) que representa um Autor na lista de resultados da Pesquisa.
 * * É um botão simples (TouchableOpacity) que, no futuro, pode redirecionar para
 * uma página com todos os livros daquele autor específico.
 */
export function CardPesquisaAutor({ nome }: Props) {
  return (
    <TouchableOpacity style={styles.authorButton} activeOpacity={0.7}>
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
  authorText: {
    fontFamily: "Poppins_700Bold",
    color: "#500903",
  },
});

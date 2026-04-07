import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

type Props = { titulo: string; autor: string; categoria: string; nota: string };

export function CardPesquisaLivro({ titulo, autor, categoria, nota }: Props) {
  return (
    <TouchableOpacity style={styles.bookCard}>
      <View style={styles.bookLeft}>
        <View style={styles.bookCoverPlaceholder}>
          <Text style={styles.bookCoverText}>Livro</Text>
        </View>
        <Text style={styles.bookRating}>{nota}</Text>
      </View>

      <View style={styles.bookRight}>
        <Text style={styles.bookTitle} numberOfLines={1}>
          {titulo}
        </Text>
        <Text style={styles.bookAuthor} numberOfLines={1}>
          {autor}
        </Text>
        <Text style={styles.bookGenre} numberOfLines={1}>
          {categoria}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  bookCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 15,
    flexDirection: "row",
    marginBottom: 15,
  },
  bookLeft: { alignItems: "center", marginRight: 15 },
  bookCoverPlaceholder: {
    width: 60,
    height: 90,
    backgroundColor: "#6F1D1B",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  bookCoverText: { color: "#FFF", fontSize: 10 },
  bookRating: { fontFamily: "Poppins_700Bold", color: "#500903", marginTop: 5 },
  bookRight: { flex: 1, justifyContent: "center" },
  bookTitle: {
    fontFamily: "Poppins_700Bold",
    color: "#500903",
    fontSize: 16,
    marginBottom: 5,
  },
  bookAuthor: {
    fontFamily: "Poppins_700Bold",
    color: "#500903",
    fontSize: 14,
    marginBottom: 5,
  },
  bookGenre: { fontFamily: "Poppins_700Bold", color: "#500903", fontSize: 14 },
});

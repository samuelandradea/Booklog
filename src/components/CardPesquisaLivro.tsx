import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

type Props = {
  titulo: string;
  autor: string;
  categoria: string;
  nota: string;
  thumbnail?: string; // Adicionamos a propriedade da imagem aqui!
};

export function CardPesquisaLivro({
  titulo,
  autor,
  categoria,
  nota,
  thumbnail,
}: Props) {
  // O mesmo truque mágico da Home para a imagem carregar no celular
  const imagemSegura = thumbnail
    ? thumbnail.replace("http:", "https:")
    : undefined;

  return (
    <TouchableOpacity style={styles.bookCard} activeOpacity={0.7}>
      <View style={styles.bookLeft}>
        {/* Lógica para mostrar a capa real ou o fundo vermelho */}
        {imagemSegura ? (
          <Image source={{ uri: imagemSegura }} style={styles.bookCoverImage} />
        ) : (
          <View style={styles.bookCoverPlaceholder}>
            <Text style={styles.bookCoverText}>Livro</Text>
          </View>
        )}

        <Text style={styles.bookRating}>{nota}</Text>
      </View>

      <View style={styles.bookRight}>
        <Text style={styles.bookTitle} numberOfLines={2}>
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
    alignItems: "center", // Centraliza tudo verticalmente
  },
  bookLeft: {
    alignItems: "center",
    marginRight: 15,
  },
  bookCoverPlaceholder: {
    width: 60,
    height: 90,
    backgroundColor: "#6F1D1B",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  bookCoverImage: {
    // Novo estilo para a imagem real
    width: 60,
    height: 90,
    borderRadius: 8,
    resizeMode: "cover",
  },
  bookCoverText: { color: "#FFF", fontSize: 10 },
  bookRating: {
    fontFamily: "Poppins_700Bold",
    color: "#500903",
    marginTop: 5,
    fontSize: 12,
  },
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

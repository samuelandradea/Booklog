import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

/**
 * Tipagem das propriedades do CardPesquisaLivro.
 * Os dados repassados para cá já devem ter sido limpos e validados pelo `livroBuilder`.
 */
type Props = {
  titulo: string;
  autor: string;
  categoria: string;
  nota: string;
  thumbnail?: string;
};

/**
 * Componente visual detalhado para exibir um Livro na lista de resultados da Pesquisa.
 * * Diferente do `CardLivro` da Home (que é compacto), este card é retangular, ocupa
 * toda a largura da tela e exibe informações detalhadas como Autor e Categoria literária.
 */
export function CardPesquisaLivro({
  titulo,
  autor,
  categoria,
  nota,
  thumbnail,
}: Props) {
  // Tratamento de segurança: O React Native exige HTTPS para carregar imagens remotas em alguns dispositivos.
  // Isso substitui o 'http' legado por 'https', caso exista uma URL.
  const imagemSegura = thumbnail
    ? thumbnail.replace("http:", "https:")
    : undefined;

  // ==========================================
  // RENDERIZAÇÃO VISUAL (JSX)
  // ==========================================
  return (
    <TouchableOpacity style={styles.bookCard} activeOpacity={0.7}>
      {/* Coluna Esquerda: Exibe a Capa e a Nota */}
      <View style={styles.bookLeft}>
        {/* Lógica para mostrar a capa real ou o fundo vinho com texto de fallback */}
        {imagemSegura ? (
          <Image source={{ uri: imagemSegura }} style={styles.bookCoverImage} />
        ) : (
          <View style={styles.bookCoverPlaceholder}>
            <Text style={styles.bookCoverText}>Livro</Text>
          </View>
        )}

        <Text style={styles.bookRating}>{nota}</Text>
      </View>

      {/* Coluna Direita: Exibe as informações textuais da obra */}
      <View style={styles.bookRight}>
        {/* numberOfLines previne que textos gigantes quebrem a interface empurrando os outros elementos */}
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
    alignItems: "center",
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
  bookGenre: {
    fontFamily: "Poppins_700Bold",
    color: "#500903",
    fontSize: 14,
  },
});

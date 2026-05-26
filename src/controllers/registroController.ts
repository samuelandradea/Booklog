import { Alert } from "react-native";
import { api } from "../lib/api";

export class RegistroController {

  static async buscarLivros(termo: string): Promise<any[]> {
    try {
      const data = await api(`/search?q=${termo}`);
      const livrosBrutos = data.livros || [];

      // Mapear para garantir que thumbnail está preenchido
      return livrosBrutos.map((livro: any) => ({
        ...livro,
        thumbnail: livro.thumbnail || livro.img || null,
        title: livro.title || "Título Desconhecido",
        authors: livro.author || livro.authors || "Autor Desconhecido",
        isbn13: livro.isbn13 || livro.isbn || "",
        id: livro.id || livro.isbn13 || livro.isbn || Math.random().toString(),
      }));

    } catch (error) {
      console.error("Erro ao buscar livros:", error);
      return [];
    }
  }

  // Salva uma nova avaliação de livro para o usuário autenticado
  // Retorna true se salvo com sucesso, false em caso de erro
  static async salvarAvaliacao(
    uid: string,
    dados: {
      bookIsbn: string;
      nomeLivro: string;
      nomeAutor: string;
      nota: number;
      resenha: string;
    }
  ): Promise<boolean> {
    try {
      await api(`/users/${uid}/reviews`, {
        method: "POST",
        body: JSON.stringify(dados),
      });
      return true;
    } catch (error: any) {
      console.error("Erro ao salvar avaliação:", error);
      Alert.alert("Erro", "Não foi possível salvar a avaliação.");
      return false;
    }
  }
}
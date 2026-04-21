import { api } from "../lib/api";
import { Alert } from "react-native";

// Controller responsável pelas operações da tela de registro de leitura
export class RegistroController {
  
    // Busca livros na API pelo termo de pesquisa digitado pelo usuário
    // Retorna uma lista de livros ou lista vazia em caso de erro
  static async buscarLivros(termo: string): Promise<any[]> {
    try {
      const data = await api(`/search?q=${termo}`);
      return data.livros || [];
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
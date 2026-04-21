import { api } from "../lib/api";
import { IReview } from "../models/ReviewModel";
import { reviewBuilder } from "../builders/reviewBuilder";
import { Alert } from "react-native";

// Controller responsável pelas operações de leitura, edição e deleção de avaliações
export class LeituraController {
  
  // Busca todas as avaliações do usuário e enriquece cada uma com a capa do livro
  // Para cada review, faz uma chamada adicional à API para buscar a thumbnail pelo isbn
  // Retorna lista de IReview ou lista vazia em caso de erro
  static async buscarReviews(uid: string): Promise<IReview[]> {
    try {
      const data = await api(`/users/${uid}/reviews`);
      
      const reviewsComCapa = await Promise.all(
        data.map(async (review: any) => {
          try {
            // busca a capa do livro pelo isbn para enriquecer a review
            const livro = await api(`/books/${review.bookIsbn}`);
            return reviewBuilder({ ...review, thumbnail: livro.thumbnail });
          } catch {
            // se não encontrar a capa, retorna a review sem thumbnail
            return reviewBuilder(review);
          }
        })
      );
      
      return reviewsComCapa;
    } catch (error) {
      console.error("Erro ao buscar reviews:", error);
      return []; // retorna lista vazia para não quebrar a tela
    }
  }

  // Atualiza a nota e/ou resenha de uma avaliação existente
  // Retorna true se atualizado com sucesso, false em caso de erro
  static async editarReview(
    reviewId: string,
    dados: { nota: number; resenha: string }
  ): Promise<boolean> {
    try {
      await api(`/reviews/${reviewId}`, {
        method: "PUT",
        body: JSON.stringify(dados),
      });
      return true;
    } catch (error) {
      console.error("Erro ao editar review:", error);
      Alert.alert("Erro", "Não foi possível atualizar a avaliação.");
      return false;
    }
  }

  // Remove permanentemente uma avaliação do usuário
  // Retorna true se deletado com sucesso, false em caso de erro
  static async deletarReview(uid: string, reviewId: string): Promise<boolean> {
    try {
      await api(`/users/${uid}/reviews/${reviewId}`, {
        method: "DELETE",
      });
      return true;
    } catch (error) {
      console.error("Erro ao deletar review:", error);
      Alert.alert("Erro", "Não foi possível deletar a avaliação.");
      return false;
    }
  }
}
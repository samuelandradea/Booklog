import { reviewBuilder } from "@/builders/reviewBuilder";
import { api } from "@/lib/api";
import { IReview } from "@/models/ReviewModel";

export class LeituraController {

  // Busca todas as reviews do usuário e enriquece cada uma com a capa do livro
  async buscarReviews(uid: string): Promise<IReview[]> {
    try {
      // Busca todas as reviews do usuário pelo UID
      const data = await api(`/users/${uid}/reviews`);

      // Para cada review, busca o livro correspondente pelo ISBN para obter a capa
      const reviewsComCapa = await Promise.all(
        data.map(async (review: any) => {
          try {
            // Busca os dados do livro para pegar o thumbnail
            const livro = await api(`/books/${review.bookIsbn}`);
            // Constrói o objeto review com o thumbnail do livro
            return reviewBuilder({ ...review, thumbnail: livro.thumbnail });
          } catch {
            // Se não encontrar o livro, constrói a review sem thumbnail
            return reviewBuilder(review);
          }
        })
      );

      return reviewsComCapa;
    } catch (error) {
      console.error("Erro ao buscar reviews:", error);
      return [];
    }
  }

  // Atualiza a nota e resenha de uma review existente
  async editarReview(
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
      throw new Error("Não foi possível atualizar a avaliação.");
    }
  }

  // Remove uma review do usuário pelo ID da review
  async deletarReview(uid: string, reviewId: string): Promise<boolean> {
    try {
      await api(`/users/${uid}/reviews/${reviewId}`, {
        method: "DELETE",
      });
      return true;
    } catch (error) {
      console.error("Erro ao deletar review:", error);
      throw new Error("Não foi possível deletar a avaliação.");
    }
  }
}
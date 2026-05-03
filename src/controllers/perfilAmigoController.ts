import { api } from "@/lib/api";
import { auth } from "@/lib/firebase";
import { followUser, getUser, unfollowUser } from "@/services/userService";
 
export type PerfilAmigoData = {
  nome: string;
  bio: string;
  seguindo: boolean;
  reviews: any[];
};
 
export class PerfilAmizadeController {
  // carrega os dados do perfil do amigo e verifica se o usuario autenticado ja o segue
  public async carregarPerfil(targetUid: string): Promise<PerfilAmigoData | null> {
    const meUid = auth.currentUser?.uid;
    if (!meUid || !targetUid) return null;
 
    try {
      const [perfilAmigo, meuPerfil] = await Promise.all([
        getUser(targetUid),
        getUser(meUid),
      ]);
 
      const seguindo = (meuPerfil?.friendIds || []).includes(targetUid);
 
      const reviewsRaw = await api(`/users/${targetUid}/reviews`);
      const reviews = await Promise.all(
        reviewsRaw.slice(0, 4).map(async (review: any) => {
          try {
            const livro = await api(`/books/${review.bookIsbn}`);
            return { ...review, thumbnail: livro.thumbnail };
          } catch {
            return review;
          }
        })
      );
 
      return {
        nome: perfilAmigo?.name || "",
        bio: perfilAmigo?.bio || "",
        seguindo,
        reviews,
      };
    } catch (err) {
      console.error("Erro ao carregar perfil do amigo:", err);
      return null;
    }
  }
 
  // alterna entre seguir e deixar de seguir e retorna o novo estado
  public async toggleSeguir(targetUid: string, seguindoAtual: boolean): Promise<boolean> {
    const meUid = auth.currentUser?.uid;
    if (!meUid || !targetUid) return seguindoAtual;
 
    try {
      if (seguindoAtual) {
        await unfollowUser(meUid, targetUid);
        return false;
      } else {
        await followUser(meUid, targetUid);
        return true;
      }
    } catch (err) {
      console.error("Erro ao atualizar amizade:", err);
      return seguindoAtual;
    }
  }
}
import { getFollowing } from "@/services/userService";
import { LeituraController } from "@/controllers/leituraController";

export interface FeedItem {
    amigo: {
        id: string;
        name: string;
    };
    reviews: any[];
}

export class FeedController {
    public async carregarFeed(uidAtual: string): Promise<FeedItem[]> {
        try {
            // reutilização do amizadesController
            const amigos = await getFollowing(uidAtual);

            // Se não retornar nada, devolve o feed vazio
            if (!amigos || amigos.length === 0) {
                return []; 
            }

            const feedFinal: FeedItem[] = [];
            
            const leituraController = new LeituraController();

            // busca dos livros que cada amigo fez reviews
            for (const amigo of amigos) {
                try {
                    const reviewsDoAmigo = await leituraController.buscarReviews(amigo.id);
                    
                    // so entra no feed os amigos que tem pelo menos uma review
                    if (reviewsDoAmigo && reviewsDoAmigo.length > 0) {
                        feedFinal.push({
                            amigo: {
                                id: amigo.id,
                                name: amigo.name,
                            },
                            reviews: reviewsDoAmigo,
                        });
                    }
                } catch (err) {
                    console.error(`Erro ao buscar reviews do amigo ${amigo.name}:`, err);
                }
            }

            return feedFinal;
        } catch (error) {
            console.error("Erro geral ao carregar o feed:", error);
            return [];
        }
    }
}
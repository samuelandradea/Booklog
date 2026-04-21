// builders/livroBuilder.ts
import { ILivro } from "../models/LivroModel";

export const livroBuilder = (livroBruto: any): ILivro => {
  return {
    // Se vier sem id, usa uma string vazia (ou gera um fallback)
    id: livroBruto.id || Math.random().toString(),
    // ISBN13 do livro — identificador universal usado para buscar detalhes na API
    isbn13: livroBruto.isbn13 || "",
    // Garante que se vier nulo, mostra "Título Desconhecido"
    titulo: livroBruto.title || "Título Desconhecido",
    // Trata os autores
    autores: livroBruto.authors || "Autor Desconhecido",
    // Se não tiver capa, coloca uma imagem genérica (placeholder)
    capa:
      livroBruto.thumbnail ||
      "https://via.placeholder.com/150x220.png?text=Sem+Capa",
    // Garante que a nota é um número
    notaMedia: livroBruto.average_rating
      ? Number(livroBruto.average_rating)
      : 0,
    anoPublicacao: livroBruto.published_year
      ? Number(livroBruto.published_year)
      : undefined,
  };
};

import { IReview } from "../models/ReviewModel";

// Builder responsável por transformar dados brutos da API em objetos IReview seguros
// Garante que todos os campos obrigatórios existam, evitando erros na interface
export const reviewBuilder = (reviewBruto: any): IReview => {
  return {
    // identificador único da avaliação no Firestore
    id: reviewBruto.id || "",
    // ISBN13 do livro avaliado, usado para buscar dados do livro na API
    bookIsbn: reviewBruto.bookIsbn || "",
    // título do livro — usa fallback caso venha nulo da API
    nomeLivro: reviewBruto.nomeLivro || "Título Desconhecido",
    // autor(es) do livro — usa fallback caso venha nulo da API
    nomeAutor: reviewBruto.nomeAutor || "Autor Desconhecido",
    // nota entre 0 e 5 — garante que seja um número
    nota: reviewBruto.nota ? Number(reviewBruto.nota) : 0,
    // texto da resenha escrita pelo usuário
    resenha: reviewBruto.resenha || "",
    // data de criação da avaliação em formato ISO
    dataCriacao: reviewBruto.dataCriacao || "",
    // URL da capa do livro — opcional, pode ser undefined
    thumbnail: reviewBruto.thumbnail || undefined,
  };
};
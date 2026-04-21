// Interface que representa o modelo de dados de uma avaliação de livro
// Usada para garantir tipagem forte em todo o projeto
export interface IReview {
  id: string;
  bookIsbn: string;
  nomeLivro: string;
  nomeAutor: string;
  nota: number;
  resenha: string;
  dataCriacao: string;
  thumbnail?: string;
}
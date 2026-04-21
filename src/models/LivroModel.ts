// Interface que representa o modelo de dados de um livro
// Usada para garantir tipagem forte em todo o projeto
export interface ILivro {
  id: string;
  isbn13: string;
  titulo: string;
  autores: string;
  capa: string;
  notaMedia: number;
  anoPublicacao?: number;
}

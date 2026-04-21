/**
 * Modelo (Model) que representa a entidade Livro no sistema.
 * * Esta interface é o "molde" oficial do nosso aplicativo. Ela garante que todo
 * livro manipulado pelas telas (seja na Home, Pesquisa ou Perfil) tenha exatamente
 * a mesma estrutura de dados, evitando que a tela quebre por tentar acessar uma
 * informação que não existe.
 */
export interface ILivro {
  id: string;
  isbn13: string;
  titulo: string;
  autores: string;
  capa: string;
  notaMedia: number;
  categoria: string;
  anoPublicacao?: number;
}

// Representa um livro retornado pela API de busca
// Usado nas telas que buscam livros como a de edição/criação de listas
export type Livro = {
    id: string
    title: string
    author: string
    img?: string
    isbn13?: string
    rating?: number
}
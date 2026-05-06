// Representa um livro retornado pela API de busca
// Usado nas telas que buscam livros como a de edição/criação de listas
export type Livro = {
    id: string
    title: string
    authors: string
    thumbnail?: string
    isbn13?: string
    average_rating?: number
}
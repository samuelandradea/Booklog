// Interface que define a estrutura de uma lista de livros
export interface IList {
    id: string
    name: string
    userId: string
    // Dicionário onde a chave é o ISBN do livro e o valor é a data de adição
    bookEntries: Record<string, string>
    createdAt: string
}

// Interface auxiliar para representar um livro dentro da lista com sua data de adição
export interface IListBookEntry {
    bookIsbn: string
    addedAt: string
}

//Interface para judar a ter todas as caracteristicas do livro
export interface IListBookFull {
    bookIsbn: string
    addedAt: string
    titulo: string
    authors: string
    thumbnail?: string
}
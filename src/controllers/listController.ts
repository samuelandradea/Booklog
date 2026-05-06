import { api } from '@/lib/api'
import {
    addBookToList,
    createList,
    deleteList,
    getList,
    getUserLists,
    removeBookFromList,
    updateList
} from '@/services/listService'

export class ListController {

    // Busca todas as listas do usuário
    async buscarListas(uid: string) {
        try {
            return await getUserLists(uid)
        } catch (error) {
            console.error('Erro ao buscar listas:', error)
            return []
        }
    }

    // Busca os detalhes de uma lista específica incluindo seus livros
    async buscarLista(listId: string) {
        try {
            return await getList(listId)
        } catch (error) {
            console.error('Erro ao buscar lista:', error)
            return null
        }
    }

    // Cria uma nova lista com o nome fornecido
    async criarLista(uid: string, name: string) {
        try {
            return await createList(uid, name)
        } catch (error) {
            console.error('Erro ao criar lista:', error)
            throw new Error('Não foi possível criar a lista.')
        }
    }

    // Atualiza o nome de uma lista existente
    async editarNomeLista(listId: string, name: string) {
        try {
            return await updateList(listId, name)
        } catch (error) {
            console.error('Erro ao editar lista:', error)
            throw new Error('Não foi possível editar a lista.')
        }
    }

    // Adiciona um livro à lista
    async adicionarLivro(listId: string, bookIsbn: string) {
        try {
            return await addBookToList(listId, bookIsbn)
        } catch (error) {
            console.error('Erro ao adicionar livro:', error)
            throw new Error('Não foi possível adicionar o livro.')
        }
    }

    // Remove um livro da lista
    async removerLivro(listId: string, bookIsbn: string) {
        try {
            return await removeBookFromList(listId, bookIsbn)
        } catch (error) {
            console.error('Erro ao remover livro:', error)
            throw new Error('Não foi possível remover o livro.')
        }
    }

    // Deleta a lista inteira
    async deletarLista(listId: string) {
        try {
            return await deleteList(listId)
        } catch (error) {
            console.error('Erro ao deletar lista:', error)
            throw new Error('Não foi possível deletar a lista.')
        }
    }

    //Busca os livros presentes na lista
    async buscarLivrosDaLista(listId: string) {
    try {
        const lista = await getList(listId)
        if (!lista) return { nome: "", livros: [] }

        // Converte o bookEntries em array de ISBNs
        const isbns = Object.keys(lista.bookEntries as Record<string, string>)

        // Para cada ISBN, busca os dados do livro no backend
        const livros = await Promise.all(
            isbns.map(async (isbn) => {
                try {
                    const livro = await api(`/books/${isbn}`)
                    return {
                        bookIsbn: isbn,
                        addedAt: lista.bookEntries[isbn],
                        titulo: livro.title || "Sem título",
                        authors: livro.authors || "",
                        thumbnail: livro.thumbnail
                            ? livro.thumbnail.replace("http:", "https:")
                            : undefined,
                    }
                } catch {
                    // Se não encontrar o livro, retorna só o ISBN
                    return {
                        bookIsbn: isbn,
                        addedAt: lista.bookEntries[isbn],
                        titulo: isbn,
                        authors: "",
                        thumbnail: undefined,
                    }
                }
            })
        )

        return { nome: lista.name, livros }
    } catch (error) {
        console.error('Erro ao buscar livros da lista:', error)
        return { nome: "", livros: [] }
    }
}
}
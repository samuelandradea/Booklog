import { api } from '@/lib/api'
import {
    addBookToList, createList, deleteList,
    getList, getUserLists, removeBookFromList, updateList
} from '@/services/listService'

export class ListController {

    async buscarListas(uid: string) {
        try {
            return await getUserLists(uid)
        } catch (error) {
            console.error('Erro ao buscar listas:', error)
            return []
        }
    }

    async buscarLista(uid: string, listId: string) {
        try {
            return await getList(uid, listId)
        } catch (error) {
            console.error('Erro ao buscar lista:', error)
            return null
        }
    }

    async buscarLivrosDaLista(uid: string, listId: string) {
        try {
            const lista = await getList(uid, listId)
            if (!lista) return { nome: "", livros: [] }

            const isbns = Object.keys(lista.bookEntries as Record<string, string>)

            const livros = await Promise.all(
                isbns.map(async (isbn) => {
                    try {
                        const livro = await api(`/books/${isbn}`)
                        return {
                            bookIsbn: isbn,
                            addedAt: lista.bookEntries[isbn],
                            titulo: livro.title || "Sem título",
                            authors: livro.author || "",
                            thumbnail: livro.img
                                ? livro.img.replace("http:", "https:")
                                : undefined,
                        }
                    } catch {
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

    async criarLista(uid: string, name: string) {
        try {
            return await createList(uid, name)
        } catch (error) {
            console.error('Erro ao criar lista:', error)
            throw new Error('Não foi possível criar a lista.')
        }
    }

    async editarNomeLista(uid: string, listId: string, name: string) {
        try {
            return await updateList(uid, listId, name)
        } catch (error) {
            console.error('Erro ao editar lista:', error)
            throw new Error('Não foi possível editar a lista.')
        }
    }

    async adicionarLivro(uid: string, listId: string, bookIsbn: string) {
        try {
            return await addBookToList(uid, listId, bookIsbn)
        } catch (error) {
            console.error('Erro ao adicionar livro:', error)
            throw new Error('Não foi possível adicionar o livro.')
        }
    }

    async removerLivro(uid: string, listId: string, bookIsbn: string) {
        try {
            return await removeBookFromList(uid, listId, bookIsbn)
        } catch (error) {
            console.error('Erro ao remover livro:', error)
            throw new Error('Não foi possível remover o livro.')
        }
    }

    async deletarLista(uid: string, listId: string) {
        try {
            return await deleteList(uid, listId)
        } catch (error) {
            console.error('Erro ao deletar lista:', error)
            throw new Error('Não foi possível deletar a lista.')
        }
    }
}
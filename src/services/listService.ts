import { api } from '@/lib/api'

// Cria uma nova lista para o usuário
export async function createList(uid: string, name: string) {
    return await api('/lists', {
        method: 'POST',
        body: JSON.stringify({ name, userId: uid }),
    })
}

// Busca todas as listas de um usuário
export async function getUserLists(uid: string) {
    return await api(`/users/${uid}/lists`)
}

// Busca uma lista específica pelo ID
export async function getList(listId: string) {
    return await api(`/lists/${listId}`)
}

// Atualiza o nome de uma lista
export async function updateList(listId: string, name: string) {
    return await api(`/lists/${listId}`, {
        method: 'PUT',
        body: JSON.stringify({ name }),
    })
}

// Adiciona um livro à lista pelo ISBN
export async function addBookToList(listId: string, bookIsbn: string) {
    return await api(`/lists/${listId}/books`, {
        method: 'POST',
        body: JSON.stringify({ bookIsbn }),
    })
}

// Remove um livro da lista pelo ISBN
export async function removeBookFromList(listId: string, bookIsbn: string) {
    return await api(`/lists/${listId}/books/${bookIsbn}`, {
        method: 'DELETE',
    })
}

// Deleta uma lista inteira
export async function deleteList(listId: string) {
    return await api(`/lists/${listId}`, {
        method: 'DELETE',
    })
}
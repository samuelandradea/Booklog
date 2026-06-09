import { api } from '@/lib/api'

export async function createList(uid: string, name: string) {
    return await api(`/users/${uid}/lists`, {
        method: 'POST',
        body: JSON.stringify({ name }),
    })
}

export async function getUserLists(uid: string) {
    return await api(`/users/${uid}/lists`)
}

export async function getList(uid: string, listId: string) {
    return await api(`/users/${uid}/lists/${listId}`)
}

export async function updateList(uid: string, listId: string, name: string) {
    return await api(`/users/${uid}/lists/${listId}`, {
        method: 'PUT',
        body: JSON.stringify({ name }),
    })
}

export async function addBookToList(uid: string, listId: string, bookIsbn: string) {
    return await api(`/users/${uid}/lists/${listId}/books`, {
        method: 'POST',
        body: JSON.stringify({ bookIsbn }),
    })
}

export async function removeBookFromList(uid: string, listId: string, bookIsbn: string) {
    return await api(`/users/${uid}/lists/${listId}/books/${bookIsbn}`, {
        method: 'DELETE',
    })
}

export async function deleteList(uid: string, listId: string) {
    return await api(`/users/${uid}/lists/${listId}`, {
        method: 'DELETE',
    })
}
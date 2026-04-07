import { api } from '@/lib/api'

export async function createUser(uid: string, data: {
    name: string,
    email: string,
    gender: string,
    birthDate: string,
}) {
    return await api(`/users/${uid}`, {
        method: 'POST',
        body: JSON.stringify(data),
    })
}

export async function updateUser(uid: string, data: Partial<{
    genres: string[]
    friendIds: string[]
    listIds: string[]
    reviewIds: string[]
}>) {
    return await api(`/users/${uid}`, {
        method: 'PUT',
        body: JSON.stringify(data),
    })
}
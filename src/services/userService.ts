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
    semanaSalva: string
    diasLidosSemana: number[]
    totalDiasLidos: number
}>) {
    return await api(`/users/${uid}`, {
        method: 'PUT',
        body: JSON.stringify(data),
    })
}
export async function getUser(uid: string) {
    // busca os dados do usuario no banco de dados a partir do uid do firebase
    return await api(`/users/${uid}`, {
        method: 'GET',
    })
}
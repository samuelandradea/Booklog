import { api } from '@/lib/api'

// funcoes responsaveis por se comunicar com a API para operacoes relacionadas ao usuario
export async function createUser(uid: string, data: {
    name: string,
    email: string,
    gender: string,
    birthDate: string,
}) {
    // cria um novo usuario no banco de dados com os dados fornecidos no cadastro
    return await api(`/users/${uid}`, {
        method: 'POST',
        body: JSON.stringify(data),
    })
}

export async function updateUser(uid: string, data: Partial<{
    name: string
    email: string
    gender: string
    birthDate: string
    bio: string
    password: string
    genres: string[]
    friendIds: string[]
    listIds: string[]
    reviewIds: string[]
    semanaSalva: string
    diasLidosSemana: number[]
    totalDiasLidos: number
    metaAnual: number
}>) {
    // atualiza os dados do usuario existente no banco de dados
    // partial permite que apenas os campos alterados sejam enviados
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

export async function followUser(uid: string, targetUid: string) {
    return await api(`/users/${uid}/follow/${targetUid}`, {
        method: 'POST',
    })
}
 
export async function unfollowUser(uid: string, targetUid: string) {
    return await api(`/users/${uid}/unfollow/${targetUid}`, {
        method: 'DELETE',
    })
}
 
export async function getFollowing(uid: string) {
    return await api(`/users/${uid}/following`, {
        method: 'GET',
    })
}
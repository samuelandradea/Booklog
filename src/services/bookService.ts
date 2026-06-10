import { api } from "@/lib/api"

export async function createBook(
    uid: string,
    data: {
        bookIsbn: string
        nomeLivro: string
        nomeAutor: string
        nota: number
        resenha: string
    },
) {
    return await api(`/users/${uid}/reviews`, {
        method: "POST",
        body: JSON.stringify(data),
    })
}

export async function getReviews(uid: string) {
    return await api(`/users/${uid}/reviews`)
}

export async function getReview(uid: string, reviewId: string) {
    return await api(`/users/${uid}/reviews/${reviewId}`)
}

export async function updateReview(
    uid: string,
    reviewId: string,
    data: { nota?: number; resenha?: string },
) {
    return await api(`/users/${uid}/reviews/${reviewId}`, {
        method: "PUT",
        body: JSON.stringify(data),
    })
}

export async function deleteReview(uid: string, reviewId: string) {
    return await api(`/users/${uid}/reviews/${reviewId}`, {
        method: "DELETE",
    })
}
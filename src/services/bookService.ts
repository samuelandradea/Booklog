import { api } from '@/lib/api'

export async function createBook(uid: string, data: {
  nomeLivro: string
  nomeAutor: string
  nota: number
  resenha: string
}) {
  return await api(`/users/${uid}/books`, {
    method: 'POST',
    body: JSON.stringify(data),
  })
}
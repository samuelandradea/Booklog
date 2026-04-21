import { api } from "@/lib/api";

export async function createBook(
  uid: string,
  data: {
    bookIsbn: string;
    nomeLivro: string;
    nomeAutor: string;
    nota: number;
    resenha: string;
  },
) {
  return await api(`/users/${uid}/reviews`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

import { livroBuilder } from "../builders/livroBuilder";
import { api } from "../lib/api";
import { ILivro } from "../models/LivroModel";

/**
 * Controller responsável por gerenciar a regra de negócio da tela Home.
 * * Este arquivo atua como um intermediário entre a interface visual
 * (a tela home.tsx) e a camada de dados (API). Ele garante que a tela fique "burra"
 * e se preocupe apenas em desenhar os componentes, enquanto o Controller faz
 * o trabalho pesado de buscar, validar e limpar os dados.
 */
export class HomeController {
  /**
   * Busca a lista principal de livros para alimentar os carrosséis da Home.
   * * @returns {Promise<ILivro[]>} Uma promessa que retorna um array de livros formatados
   * pelo `livroBuilder`. Caso a API falhe ou retorne dados inválidos, retorna um array vazio `[]`
   * para evitar que a tela quebre (Crash).
   */
  static async buscarLivrosEmAlta(): Promise<ILivro[]> {
    try {
      // Faz a requisição para o back-end usando a função genérica de API
      const dadosBrutos = await api("/books");

      // SEGURANÇA (Type Guard): Como dependemos do método .map() abaixo,
      // precisamos garantir absolutamente que o back-end devolveu um Array.
      // Se devolver uma string de erro ou um objeto null, abortamos e retornamos vazio.
      if (!Array.isArray(dadosBrutos)) {
        console.error("A API não retornou uma lista válida:", dadosBrutos);
        return [];
      }

      // Mapeia o array sujo: passa cada item individualmente pelo nosso Builder,
      // retornando uma nova lista perfeitamente tipada como ILivro[].
      const livrosLimpos = dadosBrutos.map((livro: any) => livroBuilder(livro));

      return livrosLimpos;
    } catch (error) {
      // Captura falhas de rede (ex: servidor offline, sem internet)
      console.error("Erro ao buscar livros na HomeController:", error);
      return [];
    }
  }

  static async buscarDadosUsuario(uid: string) {
  return await api(`/users/${uid}`)
}

  // controllers/homeController.ts
  static async buscarRecomendacoes(uid: string, generos: string[], topN = 9) {
    const data = await api(`/users/${uid}/recomendacoes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ generos, top_n: topN })
    });

    // Mapear para o formato ILivro que o CarrosselLivros espera
    return (data.recomendacoes ?? []).map((livro: any, index: number) => ({
      id: livro.isbn ?? livro.isbn13 ?? String(index),
      titulo: livro.title ?? 'Sem título',
      capa: (livro.img ?? '').replace('http:', 'https:'),
      notaMedia: livro.rating ?? 0,
      isbn13: livro.isbn ?? '',
      autor: livro.autor ?? '',
      genero: livro.genre ?? '',
    }));
}

}

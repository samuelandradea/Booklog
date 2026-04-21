import { livroBuilder } from "../builders/livroBuilder";
import { ILivro } from "../models/LivroModel";
import { api } from "../lib/api"; // Ajuste o caminho da pasta onde está a api.ts se necessário

export class HomeController {
  static async buscarLivrosEmAlta(): Promise<ILivro[]> {
    try {
      // CORREÇÃO: Usando a rota correta que estava no seu home.tsx original
      const dadosBrutos = await api("/books");

      // SEGURANÇA: Verifica se o back-end realmente devolveu um array antes de usar o .map()
      if (!Array.isArray(dadosBrutos)) {
        console.error("A API não retornou uma lista válida:", dadosBrutos);
        return []; // Retorna lista vazia para não quebrar a tela
      }

      // Transformando em objetos seguros com o Builder
      const livrosLimpos = dadosBrutos.map((livro: any) => livroBuilder(livro));

      return livrosLimpos;
    } catch (error) {
      console.error("Erro ao buscar livros na HomeController:", error);
      return [];
    }
  }
}

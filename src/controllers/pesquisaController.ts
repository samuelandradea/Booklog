import { livroBuilder } from "../builders/livroBuilder";
import { api } from "../lib/api";
import { ILivro } from "../models/LivroModel";

/**
 * Interface que define o formato exato da resposta da nossa Pesquisa.
 * * Garante que a tela sempre receba um objeto contendo essas três listas,
 * mesmo que a busca não encontre resultados para alguma delas.
 */
export interface IPesquisaResultado {
  /** * Lista de usuários encontrados.
   * Nota: Está como `any[]` temporariamente até criarmos um `UsuarioModel` e `usuarioBuilder`.
   */
  usuarios: any[];

  /** * Lista de autores encontrados.
   * Nota: Está como `any[]` temporariamente até criarmos um `AutorModel`.
   */
  autores: any[];

  /** * Lista de livros encontrados, já limpos e estritamente tipados pelo nosso Builder.
   */
  livros: ILivro[];
}

/**
 * Controller responsável por gerenciar a lógica de busca do aplicativo.
 * * Isola a comunicação com a rota `/search` da API, processa os dados brutos
 * e devolve um objeto organizado e seguro para a `TelaPesquisa` renderizar.
 */
export class PesquisaController {
  /**
   * Realiza uma busca global no banco de dados por livros, autores ou usuários.
   * * @param termo - O texto digitado pelo usuário na barra de pesquisa.
   * @returns {Promise<IPesquisaResultado>} Um objeto contendo as 3 listas de resultados.
   * Se a API falhar, devolve as listas vazias para evitar que o aplicativo trave.
   */
  static async buscar(termo: string): Promise<IPesquisaResultado> {
    try {
      // Faz a requisição inteligente utilizando a configuração global da nossa API,
      // resolvendo automaticamente o problema de CORS ou endereços locais (localhost).
      const dadosBrutos = await api(`/search?q=${termo}`);

      return {
        // Fallbacks de Segurança:
        // Se a API não devolver a chave 'usuarios' ou 'autores', garantimos
        // que a tela receba um array vazio [] ao invés de um valor 'undefined',
        // o que causaria um erro fatal no .map() da interface visual.
        usuarios: dadosBrutos.usuarios || [],
        autores: dadosBrutos.autores || [],

        // A mágica da POO acontece aqui: interceptamos a lista de livros "suja"
        // e passamos cada item pelo livroBuilder, garantindo capas de placeholder,
        // notas numéricas e a conversão de chaves como 'isbn13' para 'id'.
        livros: (dadosBrutos.livros || []).map((livro: any) =>
          livroBuilder(livro),
        ),
      };
    } catch (error) {
      // Intercepta erros de rede ou falhas no servidor (ex: erro 500)
      console.error("Erro na PesquisaController:", error);

      // Retorno defensivo: se tudo der errado, a tela de pesquisa apenas
      // exibirá a mensagem de "Nenhum resultado encontrado" de forma elegante.
      return { usuarios: [], autores: [], livros: [] };
    }
  }
}

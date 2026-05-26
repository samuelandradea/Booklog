import { ILivro } from "../models/LivroModel";

/**
 * Construtor (Builder/Mapper) responsável por "limpar" e padronizar os dados dos livros.
 * * Como a API ou o banco de dados podem retornar informações com nomes de variáveis diferentes
 * (ex: `isbn13` em vez de `id`) ou com campos faltando (nulos), esta função atua como
 * um escudo protetor. Ela recebe o dado "sujo" (Bruto) e devolve um objeto `ILivro`
 * estruturalmente perfeito e pronto para ser renderizado pelas telas do React Native.
 * * @param livroBruto - O objeto cru retornado pela requisição HTTP (tipado como `any`).
 * @returns Um objeto estritamente formatado e validado de acordo com a interface `ILivro`.
 */
export const livroBuilder = (livroBruto: any): ILivro => {
  return {
    // Tenta usar 'id', se falhar tenta 'isbn13'. Como último recurso de segurança,
    // gera um ID aleatório para evitar erros no keyExtractor das FlatLists do React.
    id: livroBruto.id || livroBruto.isbn || Math.random().toString(),

    // ISBN13 do livro — identificador universal usado para navegar para a tela de detalhes do livro.
    // Separado do 'id' pois o Firestore gera seu próprio identificador interno,
    // enquanto o isbn13 é necessário para buscar os dados na API externa.
    isbn13: livroBruto.isbn || livroBruto.isbn13 ||"",
    
    // Mapeia o título. Se a API retornar nulo, previne a quebra exibindo um texto padrão.
    titulo: livroBruto.title || "Título Desconhecido",

    // Mapeia os autores garantindo que sempre haverá uma string legível.
    autores: livroBruto.author || livroBruto.authors || "Autor Desconhecido",

    capa:
      livroBruto.img ||
      livroBruto.thumbnail ||
      "https://via.placeholder.com/150x220.png?text=Sem+Capa",

    // Converte a avaliação média garantindo que o tipo primitivo seja sempre 'Number'.
    // Caso a obra ainda não tenha avaliações, assume nota 0.
    notaMedia:
      livroBruto.rating || livroBruto.average_rating
        ? Number(livroBruto.rating || livroBruto.average_rating)
        : 0,

    ratingsCount: livroBruto.totalratings
      ? Number(livroBruto.totalratings)
      : 0,

    // Categoria literária com tratamento de erro embutido.
    // O banco de dados novo usa 'genre', mas mantemos 'categories' por segurança.
    categoria: livroBruto.genre || livroBruto.categories || "Sem categoria",

    anoPublicacao: undefined,
  };
};

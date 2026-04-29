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
    id: livroBruto.id || livroBruto.isbn13 || Math.random().toString(),

    // ISBN13 do livro — identificador universal usado para navegar para a tela de detalhes do livro.
    // Separado do 'id' pois o Firestore gera seu próprio identificador interno,
    // enquanto o isbn13 é necessário para buscar os dados na API externa.
    isbn13: livroBruto.isbn13 || "",
    
    // Mapeia o título. Se a API retornar nulo, previne a quebra exibindo um texto padrão.
    titulo: livroBruto.title || "Título Desconhecido",

    // Mapeia os autores garantindo que sempre haverá uma string legível.
    autores: livroBruto.authors || "Autor Desconhecido",

    // Se o livro não possuir capa, injeta uma imagem gerada automaticamente (placeholder)
    // para que a interface gráfica dos Cards não fique desconfigurada.
    capa:
      livroBruto.thumbnail ||
      "https://via.placeholder.com/150x220.png?text=Sem+Capa",

    // Converte a avaliação média garantindo que o tipo primitivo seja sempre 'Number'.
    // Caso a obra ainda não tenha avaliações, assume nota 0.
    notaMedia: livroBruto.average_rating
      ? Number(livroBruto.average_rating)
      : 0,

    // Categoria literária com tratamento de erro embutido.
    categoria: livroBruto.categories || "Sem categoria",

    // O ano é o único campo opcional na nossa interface. Se existir, converte para número.
    anoPublicacao: livroBruto.published_year
      ? Number(livroBruto.published_year)
      : undefined,
  };
};

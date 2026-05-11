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

    autores: livroBruto.author || "Autor Desconhecido",

    capa:
      livroBruto.img ||
      "https://via.placeholder.com/150x220.png?text=Sem+Capa",

    notaMedia: livroBruto.rating
      ? Number(livroBruto.rating)
      : 0,

    ratingsCount: livroBruto.totalratings
      ? Number(livroBruto.totalratings)
      : 0,

    categoria: livroBruto.genre || "Sem categoria",

    anoPublicacao: undefined,
  };
};

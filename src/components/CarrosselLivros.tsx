import { useRouter } from "expo-router";
import { useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { CardLivro } from "./CardLivro";
// IMPORTANDO O MODELO
import { ILivro } from "@/models/LivroModel";

/**
 * Tipagem das propriedades (Props) aceitas pelo Carrossel.
 * Define o que quem for usar o componente precisa (ou pode) passar para ele.
 */
type CarrosselProps = {
  /** Título da prateleira/seção (ex: "Recomendações", "Melhores do Mês") */
  titulo: string;

  /** Lista de livros tipada de forma estrita. Garante que só passem dados limpos pelo Builder. */
  dados: ILivro[];

  /** Define o layout interno do CardLivro. 'padrao' foca na nota, 'feed' foca no usuário e nota. */
  variante?: "padrao" | "feed";

  /** Define se o indicador de paginação (as bolinhas pontilhadas abaixo do carrossel) será exibido. */
  mostrarBolinhas?: boolean;

  /** Se verdadeiro, esconde o título e as informações textuais do Card, deixando apenas a capa. */
  ocultarTextos?: boolean;
};

/**
 * Componente CarrosselLivros
 * * Cria uma lista rolável horizontal (estilo prateleira) para exibir coleções de livros.
 * Suporta paginação visual ("bolinhas") e diferentes variantes de layout para os cards.
 */
export function CarrosselLivros({
  titulo,
  dados,
  variante = "padrao",
  mostrarBolinhas = true,
  ocultarTextos = false,
}: CarrosselProps) {
  const router = useRouter();

  // Estado que controla em qual "página" (conjunto de livros visíveis) o usuário está no momento
  const [paginaAtual, setPaginaAtual] = useState(0);

  // ==========================================
  // LÓGICA DE PAGINAÇÃO (BOLINHAS)
  // ==========================================

  // Calcula a quantidade de bolinhas com base no tamanho da lista.
  // Assumindo que cabem aproximadamente 3 a 4 livros no espaço de 228 pixels.
  const qtdBolinhas = dados ? Math.ceil(dados.length / 3) : 0;
  const bolinhasArray = Array.from({ length: qtdBolinhas });

  /**
   * Monitora a posição da rolagem (scroll) do usuário.
   * Divide a posição exata da tela pelo tamanho do bloco (228px) para descobrir o índice da página.
   */
  const handleScroll = (event: any) => {
    const posicaoScroll = event.nativeEvent.contentOffset.x;
    const indice = Math.round(posicaoScroll / 228);
    setPaginaAtual(indice);
  };

  // Trava de segurança: Se a lista de dados não existir ou estiver vazia,
  // o componente simplesmente não renderiza nada (desaparece da tela).
  if (!dados || dados.length === 0) {
    return null;
  }

  // ==========================================
  // RENDERIZAÇÃO VISUAL (JSX)
  // ==========================================
  return (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>{titulo}</Text>

      {/* FlatList é o componente nativo do React Native super otimizado para listas grandes */}
      <FlatList
        data={dados}
        // Identificador único de cada item (o nosso Builder garantiu que todos terão um ID válido)
        keyExtractor={(item) => item.id}
        // Configurações da Rolagem Horizontal
        horizontal={true}
        showsHorizontalScrollIndicator={false} // Esconde a barra nativa do sistema
        // Cria um efeito magnético ("snap") que força a rolagem a parar em blocos de 228 pixels
        snapToInterval={228}
        decelerationRate="fast"
        // Ligando o evento de rolagem à nossa função que atualiza a bolinha ativa
        onScroll={handleScroll}
        scrollEventThrottle={16} // Define a frequência (em ms) que o evento de scroll é disparado
        renderItem={({ item }) => {
          // Fallback final: O Builder já tratou a imagem, mas garantimos que o React Native
          // não bloqueie requisições de imagens não seguras convertendo 'http' para 'https'.
          const imagemSegura = item.capa.replace("http:", "https:");

          return (
            <CardLivro
              variante={variante}
              // O mapeamento aqui ficou limpo e 100% seguro graças à interface ILivro
              nome={item.titulo}
              nota={item.notaMedia.toString()}
              usuario={"Usuário"} // TODO: Ajustar para puxar o amigo quando houver a POO de Usuários
              thumbnail={imagemSegura}
              ocultarTextos={ocultarTextos}
              // Redireciona para a tela de informações do livro passando o ISBN (ou ID) como parâmetro
              onPress={() => router.push(`/infolivro?isbn=${item.isbn13}`)}
            />
          );
        }}
      />

      {/* Renderização Condicional do Indicador de Páginas */}
      {mostrarBolinhas && (
        <View style={styles.dotsContainer}>
          {bolinhasArray.map((_, index) => (
            <View
              key={index}
              // A bolinha recebe o estilo 'dotAtivo' apenas se o índice dela bater com a página atual
              style={[styles.dot, paginaAtual === index && styles.dotAtivo]}
            />
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  sectionContainer: { justifyContent: "center" },
  sectionTitle: {
    fontFamily: "RedHatDisplay_700Bold",
    fontSize: 18,
    color: "#500903",
    marginBottom: 4,
    marginLeft: 5,
  },
  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 6,
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: "#500903",
    opacity: 0.3,
    marginHorizontal: 3,
  },
  dotAtivo: { opacity: 1, width: 7, height: 7, borderRadius: 3.5 },
});

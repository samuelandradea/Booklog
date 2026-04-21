import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
} from "react-native";

/**
 * Propriedades aceitas pelo componente CardLivro.
 * @extends TouchableOpacityProps - Permite repassar eventos de clique (onPress), opacidade, etc.
 */
type CardLivroProps = TouchableOpacityProps & {
  /** Título do livro que será exibido abaixo da capa. */
  nome: string;

  /** Nota média ou avaliação do usuário. O sufixo "/5" é adicionado automaticamente pelo componente. */
  nota: string;

  /** Nome do usuário. Utilizado apenas quando a variante do card for "feed". */
  usuario?: string;

  /** * Define o layout e espaçamento do Card.
   * - `padrao`: Exibe Título e Nota (em itálico). Ideal para carrosséis normais.
   * - `feed`: Exibe Título, Nome do Usuário e Nota. Ideal para mostrar atividades de amigos.
   * - `grid`: Ajusta a largura para 25%, ideal para listas com várias colunas (ex: Perfil).
   */
  variante?: "padrao" | "feed" | "grid";

  /** URL da imagem da capa. O Builder já deve ter garantido que o link é HTTPS. */
  thumbnail?: string;

  /** Se verdadeiro, esconde todos os textos e exibe apenas a imagem da capa. */
  ocultarTextos?: boolean;
};

/**
 * Componente visual que representa um Livro individual.
 * * Altamente reutilizável, pode se adaptar a diferentes telas do app usando a propriedade `variante`.
 */
export function CardLivro({
  nome,
  nota,
  usuario,
  variante = "padrao",
  thumbnail,
  ocultarTextos = false, // Por padrão, os textos SEMPRE aparecem
  ...rest
}: CardLivroProps) {
  // Variáveis auxiliares para facilitar a leitura dos Ifs no JSX
  const isFeed = variante === "feed";
  const isGrid = variante === "grid";

  // ==========================================
  // RENDERIZAÇÃO VISUAL (JSX)
  // ==========================================
  return (
    <TouchableOpacity
      // Se for grid, aplica um estilo que permite empilhar vários cards lado a lado.
      // Senão, usa o estilo padrão com margem à direita (ideal para carrossel horizontal).
      style={isGrid ? styles.containerGrid : styles.container}
      activeOpacity={0.7}
      // O {...rest} aplica automaticamente propriedades extras como onPress, onLongPress, etc.
      {...rest}
    >
      {/* Renderização da Capa:
        Se existir a URL da imagem (thumbnail), renderiza o componente <Image>.
        Se vier nulo, vazio ou indefinido, desenha uma View vinho representando um "livro genérico".
      */}
      {thumbnail ? (
        <Image source={{ uri: thumbnail }} style={styles.capaImagem} />
      ) : (
        <View style={styles.capaPlaceholder} />
      )}

      {/* Renderização Condicional: Só desenha os textos se a flag 'ocultarTextos' for falsa */}
      {!ocultarTextos && (
        <>
          {/* O numberOfLines={1} garante que títulos muito grandes não quebrem o layout, adicionando '...' no final */}
          <Text style={styles.nomeLivro} numberOfLines={1}>
            {nome}
          </Text>

          {/* Renderização Variante: Altera os textos dependendo de onde o Card está sendo usado */}
          {isFeed ? (
            <>
              <Text style={styles.usuarioFeed} numberOfLines={1}>
                {usuario}
              </Text>
              <Text style={styles.notaFeed}>{nota}/5</Text>
            </>
          ) : (
            <Text style={styles.notaLivro}>nota {nota}/5</Text>
          )}
        </>
      )}
    </TouchableOpacity>
  );
}

// ==========================================
// ESTILOS (STYLESHEET)
// ==========================================
const styles = StyleSheet.create({
  container: {
    width: 64,
    alignItems: "center",
    marginRight: 12,
  },

  containerGrid: {
    width: "25%", // Permite que 4 cards caibam em uma única linha se a tela for grande o suficiente
    marginBottom: 16,
    marginRight: 0,
    alignItems: "center",
  },

  capaPlaceholder: {
    width: 64,
    height: 96,
    backgroundColor: "#6F1D1B",
    borderRadius: 12,
    marginBottom: 4,
    alignSelf: "center",
  },

  capaImagem: {
    width: 64,
    height: 96,
    borderRadius: 12,
    marginBottom: 4,
    resizeMode: "cover", // Garante que a imagem preencha todo o espaço sem distorcer (achatar)
    alignSelf: "center",
  },

  nomeLivro: {
    fontFamily: "Poppins_700Bold",
    fontSize: 10,
    color: "#500903",
    textAlign: "center",
  },

  notaLivro: {
    fontFamily: "RedHatDisplay_500Medium",
    fontStyle: "italic",
    fontSize: 9,
    color: "#500903",
    textAlign: "center",
  },

  usuarioFeed: {
    fontFamily: "RedHatDisplay_700Bold",
    fontSize: 9,
    color: "#FFFFFF",
    textAlign: "center",
    marginTop: 2,
  },

  notaFeed: {
    fontFamily: "RedHatDisplay_500Medium",
    fontSize: 9,
    color: "#FFFFFF",
    textAlign: "center",
  },
});

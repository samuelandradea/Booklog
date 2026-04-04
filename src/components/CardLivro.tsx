import {
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
} from "react-native";

type CardLivroProps = TouchableOpacityProps & {
  nome: string;
  nota: string;
  usuario?: string;
  variante?: "padrao" | "feed";
};

export function CardLivro({
  nome,
  nota,
  usuario,
  variante = "padrao",
  ...rest
}: CardLivroProps) {
  const isFeed = variante === "feed";

  return (
    <TouchableOpacity style={styles.container} activeOpacity={0.7} {...rest}>
      <View style={styles.capaPlaceholder} />

      <Text style={styles.nomeLivro} numberOfLines={1}>
        {nome}
      </Text>

      {isFeed ? (
        <>
          <Text style={styles.usuarioFeed} numberOfLines={1}>
            {usuario}
          </Text>
          <Text style={styles.notaFeed}>{nota}</Text>
        </>
      ) : (
        <Text style={styles.notaLivro}>nota {nota}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 64,
    alignItems: "center",
    marginRight: 12,
  },
  capaPlaceholder: {
    width: 64,
    height: 96,
    backgroundColor: "#6F1D1B",
    borderRadius: 12,
    marginBottom: 4,
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

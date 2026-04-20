import { useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { CardLivro } from "./CardLivro";
import { useRouter } from "expo-router";

type CarrosselProps = {
  titulo: string;
  dados: any[];
  variante?: "padrao" | "feed";
  mostrarBolinhas?: boolean;
  ocultarTextos?: boolean;
};

export function CarrosselLivros({
  titulo,
  dados,
  variante = "padrao",
  mostrarBolinhas = true,
  ocultarTextos = false,
}: CarrosselProps) {
  const router = useRouter();
  const [paginaAtual, setPaginaAtual] = useState(0);

  const qtdBolinhas = dados ? Math.ceil(dados.length / 3) : 0;
  const bolinhasArray = Array.from({ length: qtdBolinhas });

  const handleScroll = (event: any) => {
    const posicaoScroll = event.nativeEvent.contentOffset.x;
    const indice = Math.round(posicaoScroll / 228);
    setPaginaAtual(indice);
  };

  if (!dados || dados.length === 0) {
    return null;
  }

  return (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>{titulo}</Text>

      <FlatList
        data={dados}
        keyExtractor={(item, index) => item.isbn13 || index.toString()}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        snapToInterval={228}
        decelerationRate="fast"
        onScroll={handleScroll}
        scrollEventThrottle={16}
        renderItem={({ item }) => {
          const imagemSegura = item.thumbnail
            ? item.thumbnail.replace("http:", "https:")
            : undefined;

          return (
            <CardLivro
              variante={variante}
              nome={item.title || item.nome || "Sem título"}
              nota={item.average_rating || item.nota || "-"}
              usuario={item.usuario || "Usuário"} // Como ainda não temos amigos, deixamos um texto padrão
              thumbnail={imagemSegura}
              ocultarTextos={ocultarTextos}
              onPress={() => router.push(`/infolivro?isbn=${item.isbn13}`)}
            />
          );
        }}
      />

      {mostrarBolinhas && (
        <View style={styles.dotsContainer}>
          {bolinhasArray.map((_, index) => (
            <View
              key={index}
              style={[styles.dot, paginaAtual === index && styles.dotAtivo]}
            />
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    justifyContent: "center",
  },
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

import { useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { CardLivro } from "./CardLivro";

type CarrosselProps = {
  titulo: string;
  dados: any[];
  variante?: "padrao" | "feed";
  mostrarBolinhas?: boolean;
};

export function CarrosselLivros({
  titulo,
  dados,
  variante = "padrao",
  mostrarBolinhas = true,
}: CarrosselProps) {
  const [paginaAtual, setPaginaAtual] = useState(0);
  const qtdBolinhas = Math.ceil(dados.length / 3);
  const bolinhasArray = Array.from({ length: qtdBolinhas });

  const handleScroll = (event: any) => {
    const posicaoScroll = event.nativeEvent.contentOffset.x;
    const indice = Math.round(posicaoScroll / 228);
    setPaginaAtual(indice);
  };

  return (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>{titulo}</Text>

      <FlatList
        data={dados}
        keyExtractor={(item) => item.id}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        snapToInterval={228}
        decelerationRate="fast"
        onScroll={handleScroll}
        scrollEventThrottle={16}
        renderItem={({ item }) => (
          <CardLivro
            variante={variante}
            nome={item.nome}
            nota={item.nota}
            usuario={item.usuario}
          />
        )}
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

import { Entypo, Ionicons } from '@expo/vector-icons/';
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

/**
 * Tipagem das propriedades aceitas pelo componente CardNomeLista.
 */
type Props = {
    nome: string;
    variante?: "novaLista" | "listaExistente";
    onPressPrincipal?: () => void;
    onPressAcao?: () => void;
};

/**
 * Componente visual (Dumb Component) que representa uma lista na tela que contém todas as listas du usuário.
 * * É um botão que redirecionará para
 * uma página com todos os livros daquela lista
 * Também possuirá um ícone que servirá para ir para a tela de edição da respectiva lista.
 */
export function CardLista({
  nome,
  variante = "novaLista",
  onPressPrincipal,
  onPressAcao,
}: Props) {

    const isNovaLista = variante === "novaLista";
    const isListaExistente = variante === "listaExistente";

    const textoExibido = isNovaLista ? "Nova lista": nome;

    return (
        <View style={styles.container}>
            <TouchableOpacity
            style={styles.botaoPrincipal}
            onPress={onPressPrincipal}
            activeOpacity={0.7}
            >
                <Text style={styles.textoPrincipal}>{textoExibido}</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.botaoAcao}
                onPress={onPressAcao}
                activeOpacity={0.6}
            >
                {isNovaLista ? (
                    <>
                        <Entypo name="plus" size={20} color="#f2ebe5" style={styles.textoAcao} />{/* Placeholder */}
                    </>
                ):(
                    <>
                    <Ionicons name="pencil" size={20} color="#f2ebe5" style={styles.textoAcao} />{/* Placeholder */}
                    </>
                )}
                
            </TouchableOpacity>

        </View>
    );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",        
    justifyContent: "space-between", 
    alignItems: "center",        
    backgroundColor: "#500903",
    borderRadius: 8,
    marginTop: 30,
    paddingHorizontal: 15,
    paddingVertical: 6,
  },
  botaoPrincipal: {
    flex: 1, 
    flexShrink: 1,
  },
  textoPrincipal: {
    fontFamily: "Poppins_700Bold",
    color: "#f2ebe5",
    flexShrink: 1,
    fontSize: 17
  },
  botaoAcao: {
    backgroundColor: "#500903",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginLeft: 10,
  },
  textoAcao: {
    fontFamily: "Poppins_700Bold",
  },
});

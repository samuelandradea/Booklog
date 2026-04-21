import { Button } from "@/components/Button";
import { Divider } from "@/components/Divider";
import { router } from "expo-router";
import { useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from "react-native";

// Lista de gêneros literários disponíveis para seleção
const genres = [
    "Ficção",
    "Crítica Literária", 
    "Comics & HQs",
    "Biografia e autobiografia",
    "Filosofia",
    "Ficção juvenil",
    "Ciências",
    "Drama",
    "História",
    "Poesia",
    "Não-ficção juvenil",
    "Religião",
]

export default function Gostos() {
    const { width } = useWindowDimensions()

    // Calcula a largura de cada botão para caber exatamente 3 por linha
    // Desconta o padding horizontal da tela (32 + 32) e os gaps entre os 3 botões (16)
    const buttonWidth = (width - 32 - 32 - 16) / 3

    // Estado que armazena os gêneros selecionados pelo usuário
    const [selectedGenres, setSelectedGenres] = useState<string[]>([])

    // Valida a seleção e futuramente envia os gêneros para o backend
    function handleConfirm(){
        if(selectedGenres.length == 0){
            Alert.alert("Você não selecionou nenhum genêro")
            return
        }

        const userGenres = {
            genres : selectedGenres
        }
        // futuramente: await userService.updateUser(userGenres)

        router.replace("/") // COLOCAR A TELA DE HOME QUANDO FOR DESENVOLVIDA
    }

    // Adiciona ou remove um gênero da lista de selecionados ao clicar
    function handleSelectGenre(genre: string){
        if (selectedGenres.includes(genre)){
            // Se já está selecionado, remove da lista
            setSelectedGenres(prev => prev.filter(genres => genres !== genre));
        } else {
            // Se não está selecionado, adiciona na lista
            setSelectedGenres(prev => [...prev, genre])
        }
    }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.select({ ios: "padding", android: "height"})}>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
            <View style={styles.container}>
                <Text style={styles.title}>Gêneros favoritos</Text>
                <Divider />
                <Text style={styles.subtitle}>Selecione os gêneros que você mais gosta</Text>
                <Divider />

                {/* Grade de botões de gêneros — 3 por linha com flexWrap */}
                <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
                {genres.map((genre) =>
                <TouchableOpacity 
                    style={[selectedGenres.includes(genre) ? styles.selecionado : styles.normal, { width: buttonWidth }]} 
                    key={genre} 
                    onPress={() => handleSelectGenre(genre)}
                >
                    {/* Texto muda de cor conforme o estado de seleção */}
                    <Text style={selectedGenres.includes(genre) ? styles.textoSelecionado : styles.textoNormal}>
                        {genre}
                    </Text>
                </TouchableOpacity>
                )}
                </View>

                {/* Botão de confirmação centralizado */}
                <View style={{ alignItems: "center", marginTop: 24 }}>
                    <Button label="Confirmar" onPress={handleConfirm} />
                </View>
            </View>
        </ScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
    title: {
        fontFamily: "Poppins_700Bold",
        fontSize: 28,
        color: "#500903",
        textAlign: "center",
        marginBottom: 20,
    },
    subtitle: {
        fontFamily: "Poppins_700Bold",
        fontSize: 19,
        color: "#500903",
        textAlign: "center",
        marginBottom: 20,
    },
    // Estilo do botão de gênero não selecionado
    normal: {
        paddingVertical: 8,
        paddingHorizontal: 4,
        height: 48,
        borderWidth: 1,
        borderColor: "#6F1D1B",
        borderRadius: 7,
        justifyContent: "center",
        alignItems: "center",
    },
    // Estilo do botão de gênero selecionado
    selecionado: {
        paddingVertical: 8,
        paddingHorizontal: 4,
        height: 48,
        backgroundColor: "#6F1D1B",
        borderWidth: 1,
        borderColor: "#FFFFFF",
        borderRadius: 7,
        justifyContent: "center",
        alignItems: "center",
    },
    container: {
        flex: 1,
        backgroundColor: "#D4AA94",
        padding: 28,
        paddingTop: 60,
    },
    // Texto do botão não selecionado
    textoNormal: {
        fontFamily: "RedHatDisplay_500Medium",
        color: "#6F1D1B",
        textAlign: "center",
        fontSize: 14,
        paddingVertical: 8,
        paddingHorizontal: 4,
    },
    // Texto do botão selecionado
    textoSelecionado: {
        fontFamily: "RedHatDisplay_500Medium",
        color: "#FFFFFF",
        textAlign: "center",
        fontSize: 14,
        paddingVertical: 8,
        paddingHorizontal: 4,
    },
})
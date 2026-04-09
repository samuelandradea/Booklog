import { Button } from "@/components/Button";
import { Divider } from "@/components/Divider";
import { useAuth } from "@/context/authContext";
import { updateUser } from '@/services/userService';
import { router } from "expo-router";
import { useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from "react-native";

export default function Gostos() {
    const { width } = useWindowDimensions()
    const buttonWidth = (width - 32 - 32 - 16) / 3
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

    const [selectedGenres, setSelectedGenres] = useState<string[]>([])

    async function handleConfirm(){
        if(selectedGenres.length == 0){
            Alert.alert("Você não selecionou nenhum genêro")
            return
        }

        const userGenres = {
            genres : selectedGenres
        }

        const { user } = useAuth()
        const uid = user?.uid
        if (!uid) {
        alert("Usuário não encontrado.")
        return
    }
    
        try {
            await updateUser(uid, userGenres)
            router.replace("/(tabs)/home") 
        } catch (error) {
            
        }
    }

    function handleSelectGenre(genre: string){
        if (selectedGenres.includes(genre) ){
            setSelectedGenres(prev => prev.filter(genres => genres !== genre));
        }else{
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
                <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
                {genres.map((genre)=>
                <TouchableOpacity 
                style={[selectedGenres.includes(genre) ? styles.selecionado : styles.normal, { width: buttonWidth }]} 
                key={genre} 
                onPress={() => handleSelectGenre(genre)}>
                    <Text style={selectedGenres.includes(genre) ? styles.textoSelecionado : styles.textoNormal}>
                        {genre}
                    </Text>
                </TouchableOpacity>
                )}
                </View>
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
    textoNormal: {
        fontFamily: "RedHatDisplay_500Medium",
        color: "#6F1D1B",
        textAlign: "center",
        fontSize: 14,
        paddingVertical: 8,
        paddingHorizontal: 4,
    },
    textoSelecionado: {
        fontFamily: "RedHatDisplay_500Medium",
        color: "#FFFFFF",
        textAlign: "center",
        fontSize: 14,
        paddingVertical: 8,
        paddingHorizontal: 4,
    },
})


import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { Header } from "@/components/Header";
import { LeituraController } from "@/controllers/leituraController";
import { useProtectedRoute } from "@/hook/useProtectedRoute";
import { LeituraDiaria } from "@/components/leituraDiaria";



export default function Gameficacao(){
    const { user, loading} = useProtectedRoute();
    const [meta, setMeta] = useState("0");
    const [isEditing, setIsEditing] = useState(false);
    const [livrosLidos, setlivrosLidos] = useState(0);

    useFocusEffect(
        useCallback(() => {
            if (user?.uid) {
                const controller = new LeituraController();
                
                controller.buscarReviews(user.uid)
                    .then((data) => {
                        setlivrosLidos(data.length);
                    })
                    .catch((err) => console.error("Erro ao buscar livros para gameficação:", err));
            }
        }, [user])
    );

    const metaNumero = parseInt(meta) || 0; 
    const livrosRestantes = Math.max(0, metaNumero - livrosLidos);
    const porcentagemProgresso = metaNumero > 0 ? Math.min((livrosLidos / metaNumero) * 100, 100) : 0;


    if (loading) return null;
    return (
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.select({ ios: "padding", android: "height"})}>
            <View style={styles.container}>
                <Header />

                <View style={styles.cardProgresso}>
                    
                    <View style={styles.headerProgresso}>
                        <Text style={styles.titulo}>Sua meta anual:</Text>

                        {isEditing ? (
                            <View style={styles.inputContainer}>
                                <TextInput
                                    style={styles.inputMeta}
                                    value={meta}
                                    onChangeText={setMeta}
                                    keyboardType="numeric"
                                    autoFocus={true}
                                    onBlur={() => setIsEditing(false)}
                                    onSubmitEditing={() => setIsEditing(false)}
                                    maxLength={4}
                                />
                                <Text style={styles.textoLivros}> livros</Text>
                            </View>
                        ) : (
                            <TouchableOpacity onPress={() => setIsEditing(true)} activeOpacity={0.7}>
                                <Text style={styles.textoMeta}>{meta} livros</Text>
                            </TouchableOpacity>
                        )}
                    </View>

                    <View style={styles.barraFundo}>
                        <View style={[styles.barraPreenchida, { width: `${porcentagemProgresso}%` }]} />
                    </View>

                    <View style={styles.footerProgresso}>
                        <Text style={styles.textoDetalhe}>livros lidos: {livrosLidos}</Text>
                        <Text style={styles.textoDetalhe}>livros restantes: {livrosRestantes}</Text>
                    </View>

                </View>

                <LeituraDiaria />

            </View>
        </KeyboardAvoidingView>
    )
}



const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#D4AA94",
        padding: 32,
    },
    cardProgresso: {
        marginTop: 40,
        gap: 12,
    },
    headerProgresso: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    titulo: {
        fontFamily: "RedHatDisplay_700Bold",
        fontSize: 24,
        color: "#500903",
    },
    textoMeta: {
        fontFamily: "RedHatDisplay_700Bold",
        fontSize: 22,
        color: "#1F2024",
        textDecorationLine: "underline", 
    },
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    inputMeta: {
        fontFamily: "RedHatDisplay_700Bold",
        fontSize: 22,
        color: "#1F2024",
        borderBottomWidth: 2,
        borderBottomColor: "#500903",
        padding: 0,
        width: 50,
        height: 30,
        margin: 0,
        textAlign: "center",
    },
    textoLivros: {
        fontFamily: "RedHatDisplay_700Bold",
        fontSize: 22,
        color: "#1F2024",
    },
    barraFundo: {
        height: 24,
        backgroundColor: "#FFFFFF",
        borderRadius: 12,
        overflow: "hidden",
        elevation: 4, 
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
    },
    barraPreenchida: {
        height: "100%",
        backgroundColor: "#6F1D1B", 
        borderRadius: 12,
    },
    footerProgresso: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    textoDetalhe: {
        fontFamily: "RedHatDisplay_500Medium",
        fontSize: 16,
        color: "#500903",
    },
    semana: {
        backgroundColor: "#FFFFFF",
        borderRadius: 15,
        height: 150,
    }
});
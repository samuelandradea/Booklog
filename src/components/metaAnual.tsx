import React, { useState, useCallback } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "expo-router";
import { GameficacaoController } from "@/controllers/gameficacaoController";
import { useProtectedRoute } from "@/hook/useProtectedRoute";

interface MetaAnualProps {
    livrosLidos: number;
}

export function MetaAnual({ livrosLidos }: MetaAnualProps) {
    const { user } = useProtectedRoute();
    const [meta, setMeta] = useState("0");
    const [isEditing, setIsEditing] = useState(false);
    
    const controller = new GameficacaoController();

    // busca a meta atual sempre que esse componente fechar
    useFocusEffect(
        useCallback(() => {
            if (user?.uid) {
                controller.carregarProgresso(user.uid)
                    .then((dados) => {
                        console.log("Dados carregados:", dados);
                        setMeta(String(dados.metaAnual || 0));
                    })
                    .catch((err) => console.error("Erro ao buscar a meta:", err));
            }
        }, [user])
    );

    const handleExcluirMeta = async () => {
        const confirmarEExcluir = async () => {
            if (user?.uid) {
                const sucesso = await controller.excluirMetaAnual(user.uid);
                if (sucesso) {
                    setMeta("0");
                }
            }
        };

        // alerta personalizado para caso abrir o app na web ou no mobile
        if (Platform.OS === "web") {
            const querExcluir = window.confirm("Tem certeza que deseja excluir sua meta anual?");
            if (querExcluir) {
                confirmarEExcluir();
            }
        } else {
            Alert.alert(
                "Excluir Meta",
                "Tem certeza que deseja excluir sua meta anual?",
                [
                    { text: "Cancelar", style: "cancel" },
                    { text: "Excluir", style: "destructive", onPress: confirmarEExcluir }
                ]
            );
        }
    }

    const handleSalvarMeta = async () => {
        setIsEditing(false);
        if (user?.uid) {
            const numeroMeta = parseInt(meta) || 0;
            await controller.salvarMetaAnual(user.uid, numeroMeta);
        }
    };

    const metaNumero = parseInt(meta) || 0; 
    const livrosRestantes = Math.max(0, metaNumero - livrosLidos);
    const porcentagemProgresso = metaNumero > 0 ? Math.min((livrosLidos / metaNumero) * 100, 100) : 0;


    return (
        <View style={styles.cardProgresso}>
            <View style={styles.headerProgresso}>
                <Text style={styles.titulo}>Sua meta anual:</Text>

                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                    {isEditing ? (
                        <View style={styles.inputContainer}>
                            <TextInput
                                style={styles.inputMeta}
                                value={meta}
                                onChangeText={setMeta}
                                keyboardType="numeric"
                                autoFocus={true}
                                onBlur={handleSalvarMeta}
                                onSubmitEditing={handleSalvarMeta}
                                maxLength={4}
                            />
                            <Text style={styles.textoLivros}> livros</Text>
                        </View>
                    ) : (
                        <>
                            <TouchableOpacity onPress={() => setIsEditing(true)} activeOpacity={0.7}>
                                <Text style={styles.textoMeta}>{meta} livros</Text>
                            </TouchableOpacity>

                            {meta !== "0" && (
                                <TouchableOpacity onPress={handleExcluirMeta}>
                                    <Ionicons name="close-circle" size={22} color="#500903" opacity={0.6} />
                                </TouchableOpacity>
                            )}
                        </>
                    )}
                </View>
            </View>

            <View style={styles.barraFundo}>
                <View style={[styles.barraPreenchida, { width: `${porcentagemProgresso}%` }]} />
            </View>

            <View style={styles.footerProgresso}>
                <Text style={styles.textoDetalhe}>livros lidos: {livrosLidos}</Text>
                <Text style={styles.textoDetalhe}>livros restantes: {livrosRestantes}</Text>
            </View>
        </View>
    );
}


const styles = StyleSheet.create({
    cardProgresso: {
        gap: 12
    },
    headerProgresso: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    titulo: {
        fontFamily: "RedHatDisplay_700Bold",
        fontSize: 22,
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
        height: 34,
        backgroundColor: "#FFFFFF",
        borderRadius: 16,
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
    }
});
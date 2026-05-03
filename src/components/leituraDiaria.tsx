import { GameficacaoController } from "@/controllers/gameficacaoController";
import { useProtectedRoute } from "@/hook/useProtectedRoute";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const diasdaSemana = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];

export function LeituraDiaria() {
    const { user } = useProtectedRoute();
    const [diasLidos, setDiasLidos] = useState<number[]>([]);
    const [carregando, setCarregando] = useState(true);
    const controller = new GameficacaoController();
    const diaAtual = new Date().getDay(); 

    useEffect(() => {
            if (user?.uid) {
                controller.carregarProgresso(user.uid).then((dados) => {
                    setDiasLidos(dados.diasLidos); 
                    setCarregando(false);
                });
            }
        }, [user]);

    async function handleMarcarDia() {
        if (!user?.uid) return;
        if (diasLidos.includes(diaAtual)) return;

        setDiasLidos((prev) => [...prev, diaAtual]);

        await controller.marcarDiaComoLido(user.uid, diaAtual, diasLidos);
    }

    if (carregando) return <ActivityIndicator color="#500903" />;

    return (
        <View style={styles.card}>
            <View style={styles.header}>
                <Text style={styles.titulo}>Leitura diária</Text>
                <Ionicons name="calendar-outline" size={24} color="#500903" />
            </View>

            <View style={styles.diasContainer}>
                {diasdaSemana.map((letra, index) => {
                    const foiLido = diasLidos.includes(index);
                    const isHoje = index === diaAtual;
                    const isClicavel = isHoje && !foiLido;

                    return (
                        <View key={index} style={styles.diaItem}>
                            <Text style={styles.letraDia}>{letra}</Text>
                            
                            <TouchableOpacity disabled={!isClicavel} onPress={handleMarcarDia} activeOpacity={0.7}
                                style={[
                                    styles.bolinha,
                                    foiLido && styles.bolinhaLida,
                                    isHoje && !foiLido && styles.bolinhaHoje,
                                    !isHoje && !foiLido && styles.bolinhaInativa
                                ]}
                            >
                                {foiLido && (
                                    <Ionicons name="checkmark" size={18} color="#FFFFFF" />
                                )}
                            </TouchableOpacity>
                        </View>
                    );
                })}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: "#FFFFFF",
        borderRadius: 16,
        padding: 20,
        elevation: 3,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        marginTop: 20,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 16,
    },
    titulo: {
        fontFamily: "Poppins_700Bold",
        fontSize: 18,
        color: "#500903",
    },
    diasContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    diaItem: {
        alignItems: "center",
        gap: 8,
    },
    letraDia: {
        fontFamily: "RedHatDisplay_700Bold",
        fontSize: 14,
        color: "#000000",
    },
    bolinha: {
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: "center",
        alignItems: "center",
    },
    bolinhaLida: {
        backgroundColor: "#22C55E",
    },
    bolinhaHoje: {
        backgroundColor: "#e7c710",
    },
    bolinhaInativa: {
        backgroundColor: "#D1D5DB",
    }
});
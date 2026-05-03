import React from "react";
import { View, Text, StyleSheet } from "react-native";

interface ProximaConquistaProps {
    livrosLidos: number;
    totalDiasLidos: number;
}

const INSIGNIAS = [
    { nome: "leitor aprendiz", metaLivros: 10, metaDias: 20 },
    { nome: "leitor assíduo", metaLivros: 50, metaDias: 50 },
    { nome: "leitor pleno", metaLivros: 100, metaDias: 70 },
    { nome: "mestre literário", metaLivros: 200, metaDias: 150 }
];

export function ProximaConquista({ livrosLidos, totalDiasLidos }: ProximaConquistaProps) {
    const conquistaAtual = INSIGNIAS.find(
        (insignia) => livrosLidos < insignia.metaLivros || totalDiasLidos < insignia.metaDias
    ) || INSIGNIAS[INSIGNIAS.length - 1];

    // calculo das porcentagens
    const pctLivros = Math.min((livrosLidos / conquistaAtual.metaLivros) * 100, 100);
    const pctDias = Math.min((totalDiasLidos / conquistaAtual.metaDias) * 100, 100);

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.titulo}>Sua próxima conquista:</Text>
                <View style={styles.badge}>
                    <Text style={styles.badgeText}>{conquistaAtual.nome}</Text>
                </View>
            </View>


            <View style={styles.progressoContainer}>
                <Text style={styles.label}>Ler {conquistaAtual.metaLivros} livros</Text>
                <View style={styles.barraFundo}>
                    <View style={[styles.barraPreenchida, { width: `${pctLivros}%` }]} />
                </View>
            </View>

            
            <View style={styles.progressoContainer}>
                <Text style={styles.label}>{conquistaAtual.metaDias} dias de leitura</Text>
                <View style={styles.barraFundo}>
                    <View style={[styles.barraPreenchida, { width: `${pctDias}%` }]} />
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginTop: 32,
        gap: 20,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 8,
    },
    titulo: {
        fontFamily: "Poppins_700Bold",
        fontSize: 17,
        color: "#500903",
        flexShrink: 0,
    },
    badge: {
        backgroundColor: "#500903",
        paddingHorizontal: 16,
        paddingVertical: 6,
        borderRadius: 20,
        elevation: 4,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
        flexShrink: 0,
    },
    badgeText: {
        fontFamily: "RedHatDisplay_500Medium",
        fontSize: 14,
        color: "#FFFFFF",
        fontStyle: "italic",
    },
    progressoContainer: {
        gap: 4,
    },
    label: {
        fontFamily: "RedHatDisplay_500Medium",
        fontSize: 16,
        color: "#6F1D1B",
        marginLeft: 4,
    },
    barraFundo: {
        height: 24,
        backgroundColor: "#FFFFFF",
        borderRadius: 12,
        overflow: "hidden",
        elevation: 3, 
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
});
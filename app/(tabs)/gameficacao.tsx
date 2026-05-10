import { Header } from "@/components/Header"
import { LeituraDiaria } from "@/components/leituraDiaria"
import { MetaAnual } from "@/components/metaAnual"
import { ProximaConquista } from "@/components/proximaConquista"
import { GameficacaoController } from "@/controllers/gameficacaoController"
import { LeituraController } from "@/controllers/leituraController"
import { useProtectedRoute } from "@/hook/useProtectedRoute"
import { useFocusEffect } from "expo-router"
import { useCallback, useState } from "react"
import { KeyboardAvoidingView, Platform, StyleSheet, View } from "react-native"


export default function Gameficacao(){
    const { user, loading } = useProtectedRoute();
    const [livrosLidos, setLivrosLidos] = useState(0);
    const [totalDias, setTotalDias] = useState(0);
    
    useFocusEffect(
        useCallback(() => {
            if (user?.uid) {
                const leituraController = new LeituraController();
                leituraController.buscarReviews(user.uid)
                    .then((data) => setLivrosLidos(data.length))
                    .catch((err) => console.error(err));

                const controller = new GameficacaoController();
                controller.carregarProgresso(user.uid)
                    .then((dados) => setTotalDias(dados.totalDias))
                    .catch((err) => console.error(err));
            }
        }, [user])
    );


    if (loading) return null;
    return (
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.select({ ios: "padding", android: "height"})}>
            <View style={styles.container}>
                <Header />

                <View style={styles.content}>
                    <MetaAnual livrosLidos={livrosLidos} />
                    <LeituraDiaria />
                    <ProximaConquista livrosLidos={livrosLidos} totalDiasLidos={totalDias} />
                </View>

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
    content: {
        flex: 1,
        justifyContent: "space-evenly"
    }
});
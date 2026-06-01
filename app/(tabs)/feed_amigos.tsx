import { CarrosselLivros } from "@/components/CarrosselLivros";
import { Divider } from "@/components/Divider";
import { Header } from "@/components/Header";
import { FeedController, FeedItem } from "@/controllers/feedController";
import { useProtectedRoute } from "@/hook/useProtectedRoute";
import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";
import { ActivityIndicator, FlatList, KeyboardAvoidingView, Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function FeedAmigos() {
    const { user, loading } = useProtectedRoute();
    const [feed, setFeed] = useState<FeedItem[]>([]);
    const [carregando, setCarregando] = useState(true);

    const controller = new FeedController();

    useFocusEffect(
        useCallback(() => {
            if (user?.uid) {
                carregarDadosFeed(user.uid);
            }
        }, [user])
    );

    async function carregarDadosFeed(uid: string) {
        setCarregando(true);
        const data = await controller.carregarFeed(uid);
        setFeed(data);
        setCarregando(false);
    }

    if (loading) return null;

    return (
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.select({ ios: "padding", android: "height" })}>
            <View style={styles.container}>
                <Header />
                
                <Text style={styles.tituloSecao}>Avaliações dos Amigos</Text>
                <Divider style={styles.divider} />

                {carregando ? (
                    <ActivityIndicator size="large" color="#500903" style={{ marginTop: 40 }} />
                ) : (
                    <FlatList
                        data={feed}
                        keyExtractor={(item) => item.amigo.id}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ paddingBottom: 40 }}
                        ListEmptyComponent={
                            <Text style={styles.vazio}>Seus amigos ainda não avaliaram nenhum livro.</Text>
                        }
                        renderItem={({ item }) => (
                            <View style={styles.feedItem}>
                                <TouchableOpacity
                                    style={styles.usuarioRow}
                                    onPress={() =>
                                        router.push({
                                            pathname: "/perfilAmizade",
                                            params: {
                                                uid: item.amigo.id,
                                            },
                                        })
                                    }
                                >
                                    <View style={styles.avatar}>
                                        <Ionicons name="person" size={20} color="#EDD5C0" />
                                    </View>

                                    <Text style={styles.nomeUsuario}>
                                        {item.amigo.name}
                                    </Text>
                                </TouchableOpacity>

                                <CarrosselLivros
                                    titulo=""
                                    mostrarBolinhas={false}
                                    dados={item.reviews.map((r) => ({
                                        id: r.id || r.bookIsbn || Math.random().toString(),
                                        isbn13: r.bookIsbn || "",
                                        titulo: r.nomeLivro || "Título Desconhecido",
                                        autores: r.nomeAutor || "",
                                        capa: r.thumbnail
                                            ? r.thumbnail.replace("http:", "https:")
                                            : "",
                                        notaMedia: r.nota || 0,
                                        ratingsCount: 0,
                                        categoria: "",
                                    }))}
                                />
                                
                                <Divider style={styles.dividerItem} />
                            </View>
                        )}
                    />
                )}
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#D4AA94",
        paddingHorizontal: 24,
        paddingTop: 48,
    },
    tituloSecao: {
        fontFamily: "Poppins_700Bold",
        fontSize: 22,
        color: "#500903",
        marginTop: 10,
    },
    divider: {
        marginBottom: 20,
    },
    feedItem: {
        marginBottom: 24,
    },
    usuarioRow: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#F2EBE5",
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
        marginBottom: 12,
        gap: 10,
    },
    avatar: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: "#500903",
        alignItems: "center",
        justifyContent: "center",
    },
    nomeUsuario: {
        fontFamily: "Poppins_700Bold",
        fontSize: 16,
        color: "#500903",
    },
    dividerItem: {
        marginTop: 20,
        opacity: 0.5,
    },
    vazio: {
        textAlign: "center",
        marginTop: 40,
        fontFamily: "RedHatDisplay_500Medium",
        color: "#500903",
        fontSize: 16,
    },
});
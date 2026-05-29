import { RegistroController } from "@/controllers/registroController"
import { Livro } from "@/models/LivroLocal"
import { Ionicons } from "@expo/vector-icons"
import { useEffect, useState } from "react"
import {
    FlatList,
    Image,
    Modal,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

type ModalBuscaLivroProps = {
    visivel: boolean
    onFechar: () => void
    onSelecionar: (livro: Livro) => void
    livrosDaLista?: Livro[]
}

export function ModalBuscaLivro({
    visivel,
    onFechar,
    onSelecionar,
    livrosDaLista,
}: ModalBuscaLivroProps) {

    const [textoBusca, setTextoBusca] = useState("")
    const [resultados, setResultados] = useState<Livro[]>([])
    const [buscando, setBuscando] = useState(false)

    // Busca com debounce
    useEffect(() => {

        async function realizarBusca() {

            // Limpa resultados se input vazio
            if (!textoBusca.trim()) {
                setResultados([])
                return
            }

            // Busca local (remover da lista)
            if (livrosDaLista) {
                const filtrados = livrosDaLista.filter(
                    (l) =>
                        l.title.toLowerCase().includes(textoBusca.toLowerCase()) ||
                        l.author.toLowerCase().includes(textoBusca.toLowerCase())
                )

                setResultados(filtrados)
                return
            }

            try {
                setBuscando(true)

                console.log("BUSCANDO:", textoBusca)

                const livros = await RegistroController.buscarLivros(textoBusca)

                setResultados(livros)

            } catch (error) {
                console.error("Erro na busca:", error)
            } finally {
                setBuscando(false)
            }
        }

        // Espera 500ms antes de buscar
        const timeout = setTimeout(() => {
            realizarBusca()
        }, 500)

        // Cancela timeout anterior ao digitar novamente
        return () => clearTimeout(timeout)

    }, [textoBusca, livrosDaLista])

    function handleSelecionar(livro: Livro) {
        setTextoBusca("")
        setResultados([])
        onSelecionar(livro)
    }

    function handleFechar() {
        setTextoBusca("")
        setResultados([])
        onFechar()
    }

    return (
        <Modal
            visible={visivel}
            animationType="slide"
            onRequestClose={handleFechar}
        >
            <SafeAreaView style={styles.container}>

                <View style={styles.header}>
                    <Text style={styles.titulo}>
                        {livrosDaLista ? "Remover da Lista" : "Adicionar à Lista"}
                    </Text>

                    <TouchableOpacity onPress={handleFechar}>
                        <Ionicons name="close" size={28} color="#500903" />
                    </TouchableOpacity>
                </View>

                <TextInput
                    style={styles.campoBusca}
                    placeholder="Pesquisar livro..."
                    placeholderTextColor="#999"
                    value={textoBusca}
                    onChangeText={setTextoBusca}
                    autoFocus
                />

                {buscando ? (
                    <Text style={styles.textoStatus}>
                        Buscando...
                    </Text>
                ) : (
                    <FlatList
                        data={resultados}
                        keyExtractor={(item) => item.isbn || item.id}
                        renderItem={({ item }) => {

                            const thumb = item.thumbnail
                                ? item.thumbnail.replace("http:", "https:")
                                : null

                            return (
                                <TouchableOpacity
                                    style={styles.itemResultado}
                                    onPress={() => handleSelecionar(item)}
                                >
                                    {thumb ? (
                                        <Image
                                            source={{ uri: thumb }}
                                            style={styles.imagemResultado}
                                        />
                                    ) : (
                                        <View style={styles.imagemPlaceholder} />
                                    )}

                                    <View style={styles.infoResultado}>
                                        <Text
                                            style={styles.tituloResultado}
                                            numberOfLines={2}
                                        >
                                            {item.title}
                                        </Text>

                                        <Text
                                            style={styles.autorResultado}
                                            numberOfLines={1}
                                        >
                                            {item.author}
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            )
                        }}
                        ListEmptyComponent={
                            textoBusca.length > 0 ? (
                                <Text style={styles.textoStatus}>
                                    Nenhum livro encontrado
                                </Text>
                            ) : null
                        }
                    />
                )}
            </SafeAreaView>
        </Modal>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#D4AA94",
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 20,
    },
    titulo: {
        fontSize: 20,
        fontFamily: "Poppins_700Bold",
        color: "#500903",
    },
    campoBusca: {
        margin: 20,
        marginTop: 0,
        backgroundColor: "#fff",
        borderRadius: 10,
        padding: 12,
        fontSize: 16,
        color: "#333",
    },
    textoStatus: {
        textAlign: "center",
        color: "#500903",
        marginTop: 20,
        fontFamily: "RedHatDisplay_500Medium",
    },
    itemResultado: {
        flexDirection: "row",
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#C4906A",
        gap: 12,
    },
    imagemResultado: {
        width: 50,
        height: 70,
        borderRadius: 6,
    },
    imagemPlaceholder: {
        width: 50,
        height: 70,
        backgroundColor: "#6F1D1B",
        borderRadius: 6,
    },
    infoResultado: {
        flex: 1,
        justifyContent: "center",
    },
    tituloResultado: {
        fontSize: 14,
        fontFamily: "Poppins_700Bold",
        color: "#500903",
    },
    autorResultado: {
        fontSize: 12,
        fontFamily: "RedHatDisplay_500Medium",
        color: "#6F1D1B",
        marginTop: 4,
    },
})
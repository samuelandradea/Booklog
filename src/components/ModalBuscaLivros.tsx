import { RegistroController } from "@/controllers/registroController"
import { Livro } from "@/models/LivroLocal"
import { Ionicons } from "@expo/vector-icons"
import { useState } from "react"
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
    // Quando passado, a busca filtra só nesses livros em vez de chamar a API
    // Usado no campo "Remover da Lista" para buscar só o que já está na lista
    livrosDaLista?: Livro[]
}

export function ModalBuscaLivro({
    visivel,
    onFechar,
    onSelecionar,
    livrosDaLista,
}: ModalBuscaLivroProps) {
    // Texto digitado no campo de busca
    const [textoBusca, setTextoBusca] = useState("")

    // Lista de resultados exibida no modal
    const [resultados, setResultados] = useState<Livro[]>([])

    // Indica se a busca está em andamento para mostrar "Buscando..."
    const [buscando, setBuscando] = useState(false)

    // Executada toda vez que o usuário digita no campo de busca
    async function buscarLivros(termo: string) {
        setTextoBusca(termo)

        if (!termo.trim()) {
            setResultados([])
            return
        }

        // Se livrosDaLista foi passado, filtra localmente sem chamar a API
        // Isso é usado no campo "Remover da Lista"
        if (livrosDaLista) {
            const filtrados = livrosDaLista.filter(
                (l) =>
                    l.title.toLowerCase().includes(termo.toLowerCase()) ||
                    l.authors.toLowerCase().includes(termo.toLowerCase())
            )
            setResultados(filtrados)
            return
        }

        // Se livrosDaLista não foi passado, busca no dataset completo via API
        // Isso é usado no campo "Adicionar à Lista"
        setBuscando(true)
        const livros = await RegistroController.buscarLivros(termo)
        setResultados(livros)
        setBuscando(false)
    }

    // Executada quando o usuário seleciona um livro da lista de resultados
    // Limpa o estado interno e avisa a tela pai via onSelecionar
    function handleSelecionar(livro: Livro) {
        setTextoBusca("")
        setResultados([])
        onSelecionar(livro)
    }

    // Executada quando o modal é fechado sem selecionar nada
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

                {/* Cabeçalho do modal com título e botão de fechar */}
                <View style={styles.header}>
                    <Text style={styles.titulo}>
                        {/* Muda o título dependendo do contexto */}
                        {livrosDaLista ? "Remover da Lista" : "Adicionar à Lista"}
                    </Text>
                    <TouchableOpacity onPress={handleFechar}>
                        <Ionicons name="close" size={28} color="#500903" />
                    </TouchableOpacity>
                </View>

                {/* Campo de busca — autoFocus abre o teclado automaticamente */}
                <TextInput
                    style={styles.campoBusca}
                    placeholder="Pesquisar livro..."
                    placeholderTextColor="#999"
                    value={textoBusca}
                    onChangeText={buscarLivros}
                    autoFocus
                />

                {/* Renderização condicional: buscando / resultados / vazio */}
                {buscando ? (
                    <Text style={styles.textoStatus}>Buscando...</Text>
                ) : (
                    <FlatList
                        data={resultados}
                        // isbn13 como chave pois é o identificador único do livro no dataset
                        keyExtractor={(item) => item.isbn13 || item.id}
                        renderItem={({ item }) => {
                            // Converte http para https para evitar erros de segurança no iOS
                            const thumb = item.thumbnail
                                ? item.thumbnail.replace("http:", "https:")
                                : null

                            return (
                                <TouchableOpacity
                                    style={styles.itemResultado}
                                    onPress={() => handleSelecionar(item)}
                                >
                                    {/* Capa do livro ou placeholder vinho */}
                                    {thumb ? (
                                        <Image
                                            source={{ uri: thumb }}
                                            style={styles.imagemResultado}
                                        />
                                    ) : (
                                        <View style={styles.imagemPlaceholder} />
                                    )}

                                    {/* Título e autor do livro */}
                                    <View style={styles.infoResultado}>
                                        <Text style={styles.tituloResultado} numberOfLines={2}>
                                            {item.title}
                                        </Text>
                                        <Text style={styles.autorResultado} numberOfLines={1}>
                                            {item.authors}
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            )
                        }}
                        ListEmptyComponent={
                            // Só exibe "Nenhum livro encontrado" se o usuário já digitou algo
                            textoBusca.length > 0 ? (
                                <Text style={styles.textoStatus}>Nenhum livro encontrado</Text>
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
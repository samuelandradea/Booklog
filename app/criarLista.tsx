import { Button } from "@/components/Button"
import { CardLivro } from "@/components/CardLivro"
import { Header } from "@/components/Header"
import { Input } from "@/components/Input"
import { ModalBuscaLivro } from "@/components/ModalBuscaLivros"
import { ListController } from "@/controllers/listController"
import { useProtectedRoute } from "@/hook/useProtectedRoute"
import { Livro } from "@/models/LivroLocal"
import { IListBookFull } from "@/models/listModel"
import { Ionicons } from "@expo/vector-icons"
import { router, useLocalSearchParams } from "expo-router"
import { useEffect, useState } from "react"
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native"

export default function CriarLista() {
    // Parâmetros recebidos da tela anterior via router.push
    // listId e nomeAtual só existem no modo "editar"
    const { listId, nomeAtual, modo } = useLocalSearchParams<{
        listId?: string
        nomeAtual?: string
        modo: "criar" | "editar"
    }>()

    const controller = new ListController()
    const { user, loading } = useProtectedRoute()

    // Nome digitado pelo usuário no campo de nome da lista
    const [nomeLista, setNomeLista] = useState("")

    // Livros que já estão na lista — carregados do backend no modo editar
    // Usados como fonte de busca no campo "Remover da Lista"
    const [livrosDaLista, setLivrosDaLista] = useState<IListBookFull[]>([])

    // Livros selecionados pelo usuário para ADICIONAR — ainda não salvos
    const [livrosParaAdicionar, setLivrosParaAdicionar] = useState<Livro[]>([])

    // Livros selecionados pelo usuário para REMOVER — ainda não removidos
    const [livrosParaRemover, setLivrosParaRemover] = useState<Livro[]>([])

    // Controla qual modal está aberto: "adicionar", "remover" ou null (fechado)
    const [modalAberto, setModalAberto] = useState<"adicionar" | "remover" | null>(null)

    // Preenche o input de nome com o nome atual ao entrar no modo editar
    useEffect(() => {
        if (modo === "editar" && nomeAtual) {
            setNomeLista(nomeAtual)
        }
    }, [modo, nomeAtual])

    // Carrega os livros que já estão na lista no modo editar
    // Necessário para alimentar o campo "Remover da Lista"
    useEffect(() => {
        if (modo === "editar" && listId) {
            controller.buscarLivrosDaLista(listId)
                .then(({ livros }) => {
                    // Converte IListBookFull para Livro para compatibilidade com o modal
                    const livrosFormatados: Livro[] = livros.map((l) => ({
                        id: l.bookIsbn,
                        title: l.titulo,
                        authors: l.authors,
                        thumbnail: l.thumbnail,
                        isbn13: l.bookIsbn,
                    }))
                    setLivrosDaLista(livrosFormatados as any)
                })
        }
    }, [modo, listId])

    if (loading) return null

    // Salva a lista: cria ou edita o nome, adiciona e remove os livros selecionados
    async function handleSalvar() {
        if (!nomeLista.trim() || !user?.uid) return

        try {
            if (modo === "criar") {
                // Cria a lista e pega o ID gerado pelo backend
                const novaLista = await controller.criarLista(user.uid, nomeLista)

                // Adiciona sequencialmente cada livro selecionado
                for (const livro of livrosParaAdicionar) {
                    await controller.adicionarLivro(novaLista.id, livro.isbn13 || livro.id)
                }
                Alert.alert("Lista criada com sucesso")
            } else if (listId) {
                // Atualiza o nome da lista
                await controller.editarNomeLista(listId, nomeLista)

                // Adiciona os livros novos à lista existente
                for (const livro of livrosParaAdicionar) {
                    await controller.adicionarLivro(listId, livro.isbn13 || livro.id)
                }

                // Remove os livros marcados para remoção
                for (const livro of livrosParaRemover) {
                    await controller.removerLivro(listId, livro.isbn13 || livro.id)
                }
                Alert.alert("Lista editada com sucesso")
            }

            router.replace("/minhas_listas")
        } catch {
            Alert.alert("Erro ao salvar a lista")
        }
    }

    function handleDescartar() {
        router.replace("/minhas_listas")
    }

    async function handleExcluir() {
        try {
            await controller.deletarLista(listId!)
            Alert.alert("Lista excluída com sucesso")
            router.replace("/minhas_listas")
        } catch {
            Alert.alert("Erro ao excluir a lista")
        }
    }

    // Chamada quando o usuário seleciona um livro no modal de adicionar
    // Evita duplicatas verificando se o livro já está na lista de selecionados
    function handleSelecionarParaAdicionar(livro: Livro) {
        if (livrosParaAdicionar.find((l) => l.id === livro.id)) return
        setLivrosParaAdicionar((prev) => [...prev, livro])
        setModalAberto(null)
    }

    // Remove um livro da seleção de "para adicionar" ao clicar no X
    function removerDaSelecaoAdicionar(livroId: string) {
        setLivrosParaAdicionar((prev) => prev.filter((l) => l.id !== livroId))
    }

    // Chamada quando o usuário seleciona um livro no modal de remover
    function handleSelecionarParaRemover(livro: Livro) {
        if (livrosParaRemover.find((l) => l.id === livro.id)) return
        setLivrosParaRemover((prev) => [...prev, livro])
        setModalAberto(null)
    }

    // Remove um livro da seleção de "para remover" ao clicar na lixeira
    function removerDaSelecaoRemover(livroId: string) {
        setLivrosParaRemover((prev) => prev.filter((l) => l.id !== livroId))
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView
                style={styles.mainContent}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <View>
                    <Header />

                    {/* Campo de nome da lista */}
                    <View style={styles.campo}>
                        <Text style={styles.label}>Nome da Lista:</Text>
                        <Input value={nomeLista} onChangeText={setNomeLista} />
                    </View>

                    {/* Campo para adicionar livros */}
                    <View style={styles.campo}>
                        <Text style={styles.label}>Adicionar à Lista:</Text>

                        {/* TouchableOpacity no Input para abrir o modal ao clicar */}
                        <TouchableOpacity onPress={() => setModalAberto("adicionar")}>
                            <Input
                                editable={false}
                                placeholder="Buscar livro..."
                                pointerEvents="none"
                            />
                        </TouchableOpacity>

                        {/* Carrossel horizontal dos livros selecionados para adicionar */}
                        {livrosParaAdicionar.length > 0 && (
                            <ScrollView
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                style={styles.carrosselSelecionados}
                            >
                                {livrosParaAdicionar.map((livro) => (
                                    <View key={livro.id} style={styles.cardComBotao}>
                                        <CardLivro
                                            nome={livro.title}
                                            nota=""
                                            thumbnail={livro.thumbnail}
                                        />
                                        {/* Botão X para desistir de adicionar o livro */}
                                        <TouchableOpacity
                                            onPress={() => removerDaSelecaoAdicionar(livro.id)}
                                            style={styles.botaoRemoverCard}
                                        >
                                            <Ionicons name="close-outline" size={26} color="#ffffff" />
                                        </TouchableOpacity>
                                    </View>
                                ))}
                            </ScrollView>
                        )}
                    </View>

                    {/* Campo para remover livros — só aparece no modo editar */}
                    {modo === "editar" && (
                        <View style={styles.campo}>
                            <Text style={styles.label}>Remover da Lista:</Text>

                            <TouchableOpacity onPress={() => setModalAberto("remover")}>
                                <Input
                                    editable={false}
                                    placeholder="Buscar livro da lista..."
                                    pointerEvents="none"
                                />
                            </TouchableOpacity>

                            {/* Carrossel dos livros selecionados para remover */}
                            {livrosParaRemover.length > 0 && (
                                <ScrollView
                                    horizontal
                                    showsHorizontalScrollIndicator={false}
                                    style={styles.carrosselSelecionados}
                                >
                                    {livrosParaRemover.map((livro) => (
                                        <View key={livro.id} style={styles.cardComBotao}>
                                            <CardLivro
                                                nome={livro.title}
                                                nota=""
                                                thumbnail={livro.thumbnail}
                                            />
                                            {/* Ícone de lixeira para desmarcar a remoção */}
                                            <TouchableOpacity
                                                onPress={() => removerDaSelecaoRemover(livro.id)}
                                                style={styles.botaoRemoverCard}
                                            >
                                                <Ionicons name="close-outline" size={26} color="#ffffff" />
                                            </TouchableOpacity>
                                        </View>
                                    ))}
                                </ScrollView>
                            )}
                        </View>
                    )}

                    {/* Botões de ação */}
                    <View style={styles.botoes}>
                        <View style={styles.linhaBotoes}>
                            <Button label="Descartar" onPress={handleDescartar} style={styles.botao} />
                            <Button
                                label={modo === "criar" ? "Criar" : "Salvar"}
                                onPress={handleSalvar}
                                style={styles.botao}
                            />
                        </View>

                        {/* Botão de excluir lista — só aparece no modo editar */}
                        {modo === "editar" && (
                            <Button
                                label="Excluir Lista"
                                onPress={handleExcluir}
                                style={styles.botaoExcluir}
                            />
                        )}
                    </View>
                </View>
            </ScrollView>

            {/* Modal de busca para ADICIONAR — busca no dataset completo via API */}
            <ModalBuscaLivro
                visivel={modalAberto === "adicionar"}
                onFechar={() => setModalAberto(null)}
                onSelecionar={handleSelecionarParaAdicionar}
            />

            {/* Modal de busca para REMOVER — filtra só os livros que já estão na lista */}
            <ModalBuscaLivro
                visivel={modalAberto === "remover"}
                onFechar={() => setModalAberto(null)}
                onSelecionar={handleSelecionarParaRemover}
                livrosDaLista={livrosDaLista as any}
            />
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: "#D4AA94",
    },
    mainContent: {
        flex: 1,
        paddingHorizontal: 22,
        paddingTop: 10,
    },
    scrollContent: {
        paddingBottom: 40,
    },
    campo: {
        marginBottom: 16,
        gap: 4,
    },
    label: {
        fontFamily: "RedHatDisplay_700Bold",
        fontSize: 18,
        color: "#ffffff",
    },
    // Scroll horizontal dos cards selecionados
    carrosselSelecionados: {
        marginTop: 8,
    },
    // Cada card com seu botão de remover abaixo
    cardComBotao: {
        alignItems: "center",
        marginRight: 12,
    },
    botaoRemoverCard: {
        marginTop: 4,
    },
    botoes: {
        flexDirection: "column",
        marginTop: 24,
        gap: 12,
    },
    linhaBotoes: {
        flexDirection: "row",
        gap: 12,
    },
    botao: {
        flex: 1,
        height: 40,
        backgroundColor: "#6F1D1B",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 10,
    },
    botaoExcluir: {
        height: 40,
        backgroundColor: "#bb1000",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 10,
    },
})
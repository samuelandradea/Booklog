import { Ionicons } from "@expo/vector-icons"
import { Divider } from "@/components/Divider"
import { Input } from "@/components/Input"
import { InputPerfil } from "@/components/VariacaoInput"
import { ConfiguracoesController, DadosPerfil } from "@/controllers/configuracoesController"
import { auth } from "@/lib/firebase"
import { router } from "expo-router"
import { useEffect, useRef, useState } from "react"
import { Alert, Animated, KeyboardAvoidingView, Modal, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View} from "react-native"

// instancia do controller fora do componente
const controller = new ConfiguracoesController()

const generos = ["Mulher", "Homem", "Outro"]

// tela responsavel por exibir e permitir a edicao dos dados do perfil do usuario
export default function Configuracoes() {
    const [original, setOriginal] = useState<DadosPerfil>({
        nome: "", email: "", bio: "", dataNascimento: "", genero: "", senha: ""
    })
    const [editado, setEditado] = useState<DadosPerfil>({
        nome: "", email: "", bio: "", dataNascimento: "", genero: "", senha: ""
    })

    // controle do modal de confirmacao
    const [modalVisivel, setModalVisivel] = useState(false)
    const [senhaAtual, setSenhaAtual] = useState("")
    const [alteracoes, setAlteracoes] = useState<string[]>([])

    // controle do toast (mensagem que esmaece sozinha)
    const [toastMensagem, setToastMensagem] = useState("")
    const toastOpacity = useRef(new Animated.Value(0)).current

    // carrega os dados do usuario ao abrir a tela
    useEffect(() => {
        const uid = auth.currentUser?.uid
        if (!uid) return
        controller.carregarDados(uid).then((dados) => {
            if (dados) {
                setOriginal(dados)
                setEditado(dados)
            }
        })
    }, [])

    // exibe o toast e o faz esmaecer apos 3 segundos
    function exibirToast(mensagem: string) {
        setToastMensagem(mensagem)
        toastOpacity.setValue(1)
        Animated.timing(toastOpacity, {
            toValue: 0,
            duration: 3000,
            useNativeDriver: true,
        }).start()
    }

    // abre o modal apenas se houver campos alterados
    function handleAbrirModal() {
        const campos = controller.detectarAlteracoes(original, editado)
        if (campos.length === 0) {
            Alert.alert("Nenhuma alteração", "Nenhum campo foi modificado.")
            return
        }
        setAlteracoes(campos)
        setSenhaAtual("")
        setModalVisivel(true)
    }

    // confirma as alteracoes, reautentica e salva os dados
    async function handleConfirmarSalvar() {
        const uid = auth.currentUser?.uid
        if (!uid) return
        if (!senhaAtual.trim()) {
            Alert.alert("Atenção", "Digite sua senha atual para confirmar.")
            return
        }

        setModalVisivel(false)
        const sucesso = await controller.salvarAlteracoes(uid, original, editado, senhaAtual)

        if (sucesso) {
            // exibe toast de sucesso e volta para o perfil apos esmaecer
            exibirToast("Dados salvos")
            setTimeout(() => router.replace("/(tabs)/profile"), 1000)
        } else {
            // exibe toast de erro e volta para configuracoes
            exibirToast("Não foi possível alterar seus dados")
            setTimeout(() => router.replace("/configuracoes"), 1000)
        }
    }

    function handleDescartar() {
        Alert.alert(
            "Descartar alterações",
            "Tem certeza que deseja descartar as alterações?",
            [
                { text: "Cancelar", style: "cancel" },
                { text: "Descartar", onPress: () => { setEditado(original); router.back() } },
            ]
        )
    }

    async function handleExcluirConta() {
        Alert.alert(
            "Excluir conta",
            "Essa ação é irreversível. Deseja realmente excluir sua conta?",
            [
                { text: "Cancelar", style: "cancel" },
                {
                    text: "Excluir",
                    style: "destructive",
                    onPress: async () => {
                        const sucesso = await controller.excluirConta(senhaAtual)
                        if (sucesso) router.replace("/")
                        else Alert.alert("Erro", "Não foi possível excluir a conta.")
                    }
                }
            ]
        )
    }

    return (
        <KeyboardAvoidingView style={{ flex: 1 }} 
            behavior={Platform.select({ ios: "padding", android: "height" })}>
            <ScrollView style={styles.scrollView} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">

                {/* HEADER */}
                <TouchableOpacity onPress={() => router.back()}>
                    <Text style={styles.logo}>booklog</Text>
                </TouchableOpacity>
                <View style={styles.headerRow}>
                    <TouchableOpacity onPress={() => router.back()}>
                        <Ionicons name="chevron-back" size={24} color="#500903" />
                    </TouchableOpacity>
                    <Text style={styles.titulo}>Configurações</Text>
                </View>

                <Divider style={styles.dividerCompacto} />

                {/* AVATAR + DATA DE NASCIMENTO E GENERO */}
                <View style={styles.avatarRow}>
                    <View style={styles.avatar}>
                        <Ionicons name="person" size={48} color="#D4AA94" />
                    </View>
                    <View style={styles.camposLaterais}>
                        <InputPerfil
                          label="Nome de usuário"
                          value={editado.nome}
                          onChangeText={(v) => setEditado({ ...editado, nome: v })}
                        />
                    </View>
                </View>

                {/* SELECAO DE GENERO — igual ao cadastro */}
                <Text style={styles.label}>Gênero:</Text>
                <View style={styles.genderContainer}>
                    {generos.map((item) => (
                        <TouchableOpacity
                            key={item}
                            style={[styles.genderButton, editado.genero === item && styles.genderButtonActive]}
                            onPress={() => setEditado({ ...editado, genero: item })}
                            activeOpacity={0.7}
                        >
                            <Text style={[styles.genderText, editado.genero === item && styles.genderTextActive]}>
                                {item}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <Divider style={styles.dividerCompacto} />

                {/* CAMPOS DE TEXTO */}
                <View style={styles.campos}>
                  <InputPerfil
                    label="Data de Nascimento"
                    value={editado.dataNascimento}
                    onChangeText={(v) => setEditado({ ...editado, dataNascimento: v })}
                  />
                  <InputPerfil
                    label="Bio"
                    value={editado.bio}
                    onChangeText={(v) => setEditado({ ...editado, bio: v })}
                  />
                  <InputPerfil
                    label="Email"
                    value={editado.email}
                    onChangeText={(v) => setEditado({ ...editado, email: v })}
                    keyboardType="email-address"
                  />
                  <InputPerfil
                    label="Senha"
                    value={editado.senha}
                    onChangeText={(v) => setEditado({ ...editado, senha: v })}
                    secureTextEntry
                  />
                </View>

                {/* BOTOES */}
                <View style={styles.botoesRow}>
                    <TouchableOpacity style={styles.botaoSecundario} onPress={handleDescartar}>
                        <Text style={styles.botaoSecundarioTexto}>Descartar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.botaoSecundario} onPress={handleAbrirModal}>
                        <Text style={styles.botaoSecundarioTexto}>Salvar</Text>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity style={styles.botaoExcluir} onPress={handleExcluirConta}>
                    <Text style={styles.botaoExcluirTexto}>Excluir conta</Text>
                </TouchableOpacity>

            </ScrollView>

            {/* MODAL DE CONFIRMACAO */}
            <Modal visible={modalVisivel} transparent animationType="fade" onRequestClose={() => setModalVisivel(false)}>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalBox}>
                        <Text style={styles.modalTitulo}>Você realmente deseja alterar:</Text>

                        {/* lista dos campos alterados */}
                        {alteracoes.map((campo) => (
                            <Text key={campo} style={styles.modalItem}>• {campo}</Text>
                        ))}

                        <Divider style={styles.dividerCompacto} />

                        {/* input de senha para confirmar */}
                        <Input
                            placeholder="Digite sua senha atual"
                            value={senhaAtual}
                            onChangeText={setSenhaAtual}
                            secureTextEntry
                        />

                        <View style={styles.modalBotoes}>
                            <TouchableOpacity style={styles.botaoSecundario} onPress={() => setModalVisivel(false)}>
                                <Text style={styles.botaoSecundarioTexto}>Cancelar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.botaoSecundario} onPress={handleConfirmarSalvar}>
                                <Text style={styles.botaoSecundarioTexto}>Confirmar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* TOAST — mensagem que esmaece sozinha */}
            <Animated.View style={[styles.toast, { opacity: toastOpacity }]}>
                <Text style={styles.toastTexto}>{toastMensagem}</Text>
            </Animated.View>

        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    scrollView: {
        flex: 1,
        backgroundColor: "#D4AA94",
    },
    content: {
        padding: 24,
        paddingTop: 48,
        gap: 12,
    },
    logo: {
        fontFamily: "Poppins_700Bold",
        fontSize: 24,
        color: "#6F1D1B",
    },
    headerRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginTop: 4,
    },
    titulo: {
        fontFamily: "Poppins_700Bold",
        fontSize: 22,
        color: "#500903",
    },
    dividerCompacto: {
        marginVertical: 4,
    },
    dividerInput: {
        marginVertical: 2,
        backgroundColor: "#500903",
        opacity: 0.3,
    },
    avatarRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
    },
    avatar: {
        width: 90,
        height: 90,
        borderRadius: 45,
        backgroundColor: "#6F1D1B",
        alignItems: "center",
        justifyContent: "center",
    },
    camposLaterais: {
        flex: 1,
    },
    label: {
        fontFamily: "RedHatDisplay_700Bold",
        color: "#6F1D1B",
        fontSize: 18,
        marginTop: 4,
    },
    genderContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        gap: 8,
    },
    genderButton: {
        flex: 1,
        height: 48,
        borderWidth: 1,
        borderColor: "#6F1D1B",
        borderRadius: 7,
        justifyContent: "center",
        alignItems: "center",
    },
    genderButtonActive: {
        backgroundColor: "#F2EBE5",
    },
    genderText: {
        fontFamily: "RedHatDisplay_500Medium",
        color: "#6F1D1B",
    },
    genderTextActive: {
        color: "#6F1D1B",
    },
    campos: {
        gap: 4,
    },
    botoesRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        gap: 12,
        marginTop: 8,
    },
    botaoSecundario: {
        flex: 1,
        height: 44,
        backgroundColor: "#FFFFFF",
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center",
    },
    botaoSecundarioTexto: {
        fontFamily: "RedHatDisplay_500Medium",
        fontSize: 16,
        color: "#500903",
    },
    botaoExcluir: {
        height: 44,
        backgroundColor: "#6F1D1B",
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 4,
    },
    botaoExcluirTexto: {
        fontFamily: "RedHatDisplay_500Medium",
        fontSize: 16,
        color: "#FFFFFF",
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.5)",
        justifyContent: "center",
        alignItems: "center",
        padding: 24,
    },
    modalBox: {
        backgroundColor: "#D4AA94",
        borderRadius: 16,
        padding: 24,
        width: "100%",
        gap: 8,
    },
    modalTitulo: {
        fontFamily: "Poppins_700Bold",
        fontSize: 16,
        color: "#500903",
        marginBottom: 4,
    },
    modalItem: {
        fontFamily: "RedHatDisplay_500Medium",
        fontSize: 14,
        color: "#6F1D1B",
    },
    modalBotoes: {
        flexDirection: "row",
        gap: 12,
        marginTop: 8,
    },
    toast: {
        position: "absolute",
        bottom: 48,
        alignSelf: "center",
        backgroundColor: "#6F1D1B",
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 24,
    },
    toastTexto: {
        color: "#FFFFFF",
        fontFamily: "RedHatDisplay_500Medium",
        fontSize: 14,
    },
})
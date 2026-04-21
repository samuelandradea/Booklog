import { Ionicons } from "@expo/vector-icons"
import { Button } from "@/components/Button"
import { Divider } from "@/components/Divider"
import { Input } from "@/components/Input"
import { getPerfil, salvarPerfil, excluirConta } from "@/services/authService"
import { router } from "expo-router"
import { useEffect, useState } from "react"
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native"

export default function Configuracoes() {
  const [nome, setNome] = useState("")
  const [bio, setBio] = useState("")
  const [email, setEmail] = useState("")
  const [senha, setSenha] = useState("")
  const [senhaAtual, setSenhaAtual] = useState("")
  const [dataNascimento, setDataNascimento] = useState("")
  const [genero, setGenero] = useState("")

  // Carrega dados atuais do usuário ao abrir a tela
  useEffect(() => {
    async function carregarPerfil() {
      try {
        const dados = await getPerfil()
        if (dados) {
          setNome(dados.nome ?? "")
          setBio(dados.bio ?? "")
          setEmail(dados.email ?? "")
          setDataNascimento(dados.dataNascimento ?? "")
          setGenero(dados.genero ?? "")
        }
      } catch {
        Alert.alert("Erro", "Não foi possível carregar os dados do perfil.")
      }
    }
    carregarPerfil()
  }, [])

  async function handleSalvar() {
    if (!senhaAtual.trim()) {
      return Alert.alert("Senha atual obrigatória", "Informe sua senha atual para salvar as alterações.")
    }
    try {
      await salvarPerfil({ nome, bio, email, senha, dataNascimento, genero, senhaAtual })
      Alert.alert("Sucesso", "Perfil atualizado com sucesso!")
    } catch {
      Alert.alert("Erro", "Não foi possível salvar. Verifique sua senha atual.")
    }
  }

  function handleDescartar() {
    Alert.alert(
      "Descartar alterações",
      "Tem certeza que deseja descartar as alterações?",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Descartar", onPress: () => router.back() },
      ]
    )
  }

  function handleExcluir() {
    Alert.alert(
      "Excluir conta",
      "Essa ação é irreversível. Deseja realmente excluir sua conta?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            if (!senhaAtual.trim()) {
              return Alert.alert("Senha atual obrigatória", "Informe sua senha atual para excluir a conta.")
            }
            try {
              await excluirConta(senhaAtual)
              router.replace("/")
            } catch {
              Alert.alert("Erro", "Não foi possível excluir a conta. Verifique sua senha atual.")
            }
          }
        },
      ]
    )
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.select({ ios: "padding", android: "height" })}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">

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

        <View style={styles.avatarRow}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={48} color="#D4AA94" />
          </View>
          <View style={styles.camposLaterais}>
            <Input placeholder="Data de Nascimento" value={dataNascimento} onChangeText={setDataNascimento} />
            <Input placeholder="Gênero" value={genero} onChangeText={setGenero} />
          </View>
        </View>

        <View style={styles.campos}>
          <Input placeholder="Nome de usuário" value={nome} onChangeText={setNome} />
          <Input placeholder="Bio" value={bio} onChangeText={setBio} />
          <Input placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" />
          <Input placeholder="Nova senha (opcional)" value={senha} onChangeText={setSenha} secureTextEntry />
        </View>

        <View style={styles.botoesRow}>
          <Button label="Descartar" onPress={handleDescartar} />
          <Button label="Salvar" onPress={handleSalvar} />
        </View>

        <Button label="Excluir conta" onPress={handleExcluir} />

      </ScrollView>
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
    gap: 8,
  },
  campos: {
    gap: 8,
  },
  botoesRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    marginTop: 12,
  },
})
import { Button } from "@/components/Button"
import { Header } from "@/components/Header"
import { Input } from "@/components/Input"
import { ListController } from "@/controllers/listController"
import { useProtectedRoute } from "@/hook/useProtectedRoute"
import { IList } from "@/models/listModel"
import { router, useLocalSearchParams } from "expo-router"
import { useEffect, useState } from "react"
import { Alert, SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native"


export default function criarLista(){

    const { listId, nomeAtual, modo } = useLocalSearchParams<{
      listId?: string
      nomeAtual?: string
      modo: "criar" | "editar"
    }>()

    const controller = new ListController()
    const { user, loading } = useProtectedRoute()
    const [nomeLista, setNomeLista] = useState("")
    const [listas, setListas] = useState<IList[]>([])
    
    if (loading) return null;

    useEffect(() => {
      if (modo === "editar" && nomeAtual) {
        setNomeLista(nomeAtual)
      }
    }, [modo, nomeAtual])

    async function handleSalvar() {
    if (!nomeLista.trim() || !user?.uid) return
    
    if (modo === "criar") {
        await controller.criarLista(user.uid, nomeLista)
        Alert.alert("A lista foi criada com sucesso")
    } else {
        await controller.editarNomeLista(listId!, nomeLista)
        Alert.alert("A lista foi editada com sucesso")
    }
    
    router.replace("/minhas_listas") 
    }

    function handleDescartar(){
      router.replace("/minhas_listas")
    }

    async function handleExcluir(){
      await controller.deletarLista(listId!)
      Alert.alert("A lista foi exclúida com sucesso")
      router.replace("/minhas_listas")
    }

    return(
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          style={styles.mainContent}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          >
            <View>
              <Header />
                <View style={styles.campo}>
                  <Text style={styles.label}>Nome da Lista:</Text>
                  <Input value={nomeLista} onChangeText={setNomeLista} />
                </View>
                <View style={styles.campo}>
                  <Text style={styles.label}>Adicionar à Lista:</Text>
                  <Input />
                </View>
                {modo === "editar" && (
                  <>
                    <View style={styles.campo}>
                      <Text style={styles.label}>Remover da lista:</Text>
                      <Input />
                    </View>
                  </>
                )}
                <View style={styles.botoes}>
                  <View style={styles.linhaBotoes}>
                    <Button label="Descartar" onPress={handleDescartar} style={styles.botao} />
                    <Button
                    label={modo === "criar" ? "Criar" : "Salvar"}
                    onPress={handleSalvar}
                    style={styles.botao}
                    />
                  </View> 
                {modo === "editar" && (
                  <>
                    <Button label="Excluir Lista" onPress={handleExcluir} style={styles.botaoExcluir} />
                  </>
                )}
                </View>
            </View>
          </ScrollView>
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
      botoes: {
        flexDirection: "column",
        justifyContent: "space-between",
        marginTop: 24,
        gap: 12,
      },
      campo: {
        gap: 0,
        marginBottom: 16,
      },
      label: {
        fontFamily: "RedHatDisplay_700Bold",
        fontSize: 18,
        color: "#ffffff",
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

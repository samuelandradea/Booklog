import { CardLista } from "@/components/CardNomeLista";
import { Header } from "@/components/Header";
import { ListController } from "@/controllers/listController";
import { useProtectedRoute } from "@/hook/useProtectedRoute";
import { IList } from "@/models/listModel";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function minhas_listas() {
  // Instância do controller responsável pela lógica de negócio das listas
  const controller = new ListController()

  // Verifica se o usuário está logado e redireciona para login se não estiver
  const { user, loading } = useProtectedRoute();

  // Estado local que armazena as listas do usuário retornadas pelo backend
  const [listas, setlistas] = useState<IList[]>([])

  // Busca as listas do usuário sempre que a tela recebe foco
  // Isso garante que a lista seja atualizada ao voltar da tela de criar/editar
  useFocusEffect(
    useCallback(() => {
      if (user?.uid) {
        controller.buscarListas(user.uid)
          .then(data => setlistas(data))
          .catch(err => console.error("Erro ao buscar listas:", err))
      }
    }, [user?.uid]) // Só reexecuta se o UID do usuário mudar
  )

  // Aguarda a verificação de autenticação antes de renderizar a tela
  if (loading) return null;

  // Navega para a tela de criação passando o modo "criar" como parâmetro
  function handleCriarLista() {
    router.push({
      pathname: "/criarLista",
      params: { modo: "criar" }
    })
  }

  // Navega para a tela de edição passando o ID e nome atual da lista como parâmetros
  // O nome atual é usado para preencher o input de nome na tela de edição
  function handleEditarLista(listId: string, nome: string) {
    router.push({
      pathname: "/criarLista",
      params: { listId, nomeAtual: nome, modo: "editar" }
    })
  }

  // Navega para a tela interna da lista passando o ID como parâmetro
  function handleEntrarLista(listId: string) {
    router.push({
      pathname: "/dentroLista",
      params: { listId }
    })
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

          {/* Card fixo de "Nova Lista" — sempre aparece no topo da lista */}
          <CardLista
            nome={""}
            variante="novaLista"
            onPressPrincipal={handleCriarLista}
            onPressAcao={handleCriarLista}
          />

          {/* Renderiza um CardLista para cada lista do usuário retornada pelo backend */}
          {listas.map((lista) => (
            <CardLista
              key={lista.id} // Identificador único obrigatório para listas no React
              nome={lista.name}
              variante="listaExistente"
              // Ao clicar no card principal, entra na lista para ver os livros
              onPressPrincipal={() => handleEntrarLista(lista.id)}
              // Ao clicar no ícone de ação, abre a tela de edição com os dados da lista
              onPressAcao={() => handleEditarLista(lista.id, lista.name)}
            />
          ))}
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
    // Respiro extra no fim da rolagem para os últimos itens não encostarem no menu inferior (Tab Bar)
    paddingBottom: 40,
  },
})
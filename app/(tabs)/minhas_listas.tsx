import { CardLista } from "@/components/CardNomeLista";
import { Header } from "@/components/Header";
import { ListController } from "@/controllers/listController";
import { useProtectedRoute } from "@/hook/useProtectedRoute";
import { IList } from "@/models/listModel";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function minhas_listas(){
  const controller = new ListController()
  const { user, loading } = useProtectedRoute();
  const [listas, setlistas] = useState<IList[]>([])

  useFocusEffect(() =>{
    const buscarListas = async() => {
      useCallback(() => {
        if (user?.uid){
          controller.buscarListas(user.uid)
            .then(data => setlistas(data))
        }
      }, [user])
    };

    if (!loading) {
      buscarListas();
    }
});

if (loading) return null;

function handleCriarLista(){
  router.replace("/criarLista")
}

function handleEntrarLista(){
  //Redirecionar para tela de dentro da lista quando implementada
}

function handleEditarLista(){
  //Redirecionar para tela de edição de lista quando implementada
}

//RENDERIZAÇÃO DA TELA

return(
  <SafeAreaView style={styles.safeArea}>
    <ScrollView
      style={styles.mainContent}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
      >
        <View>
          <Header />
          <CardLista
           nome={""}
           variante="novaLista"
           onPressPrincipal={handleCriarLista}
           onPressAcao={handleCriarLista}
           />
           {listas.map((lista, index) => (
            <CardLista
            nome={lista.name}
            variante="listaExistente"
            onPressPrincipal={handleEntrarLista}
            onPressAcao={handleEditarLista}
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
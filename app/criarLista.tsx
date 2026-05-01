import { Button } from "@/components/Button"
import { Header } from "@/components/Header"
import { Input } from "@/components/Input"
import { useState } from "react"
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native"

export default function criarLista(){

    const [nomeLista, setNomeLista] = useState("")

    return(
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          style={styles.mainContent}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          >
            <View>
              <Header />
                <Text>Nome da lista:</Text>
                <Input onChangeText={setNomeLista} />
                <Text>Adicionar à lista:</Text>
                <Input />
                <Text>Remover da lista:</Text>
                <Input />
                <Button label={"Descartar"}></Button>
                <Button label={"Criar"}></Button>
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

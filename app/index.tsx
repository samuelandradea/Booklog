import { Button } from "@/components/Button"
import { Divider } from "@/components/Divider"
import { FooterLink } from "@/components/Footerlink"
import { Input } from "@/components/Input"
import { router } from "expo-router"
import { useState } from "react"
import { Image, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from "react-native"

import { LoginController } from "@/controllers/loginController"
export default function Index(){
    // gerenciamento do estado local apenas pra capturar os dados da interface
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    // instancia do controller pra fazer a logica de autenticacao
    const controller = new LoginController()

    // funcao que coleta os dados informados e passa para o controller. caso esteja tudo certo, navega ate a home
    async function handleSignIn() {
        const sucesso = await controller.fazerLogin(email, password)
        if (sucesso) {
            router.replace("/(tabs)/home")
        }
    }

    return (
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.select({ ios: "padding", android: "height"})}>
            <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
                <View style={styles.container}>
                    <Image source={require("@/assets/booklog-logo.png")} style={styles.illustrarion}></Image>

                    <Text style={styles.title}>booklog</Text>

                    <View style={styles.form} >
                        <Input placeholder="E-mail" keyboardType="email-address" onChangeText={( text ) => setEmail(text)}></Input>
                        <Input placeholder="Senha" secureTextEntry onChangeText={setPassword}></Input>
                        <Button label="Entrar" onPress={handleSignIn}></Button>
                    </View>
                    <Divider />
                    <FooterLink linkLabel="Esqueci minha senha" href="/recuperar_conta" />
                    <FooterLink text="Não possui uma conta?" linkLabel="Cadastre-se aqui!" href="/cadastro" />
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#D4AA94",
        padding: 32,
    },
    illustrarion: {
        width: "100%",
        height: 180,
        resizeMode: "contain",
        marginTop: 100,
    },
    title: {
        fontFamily: "Poppins_700Bold",
        fontSize: 48,
        color: "#6F1D1B",
        textAlign: "center",
    },
    form: {
        gap: 12,
        marginTop: 24,
    },
})
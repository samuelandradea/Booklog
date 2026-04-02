import { Button } from "@/components/Button"
import { Input } from "@/components/Input"
import { FooterLink } from "@/components/Footerlink"
import { Divider } from "@/components/Divider"
import { useState } from "react"
import { Alert, Image, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from "react-native"

export default function Index(){
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    function handleSignIn() {
        if(!email.trim() || !password.trim()) {
            return Alert.alert("Preencha os campos", "Preencha os campos corretamente para entrar.")
        }

        Alert.alert("Bem-vinda(o)", `Seja bem-vinda(o) ${email}`)
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
                    <FooterLink linkLabel="Esqueci minha senha" href="/" />
                    <FooterLink text="Não possui uma conta?" linkLabel="Cadastre-se aqui!" href="/" />
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
import { Button } from "@/components/Button"
import { Divider } from "@/components/Divider"
import { FooterLink } from "@/components/Footerlink"
import { Input } from "@/components/Input"
import { router } from "expo-router"
import { useState } from "react"
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { TextInputMask } from 'react-native-masked-text'
import { CadastroController } from "@/controllers/cadastroController"

// tela responsavel por capturar as entradas do usuario e repassar pro controller
export default function Signup() {
    // gerenciamento do estado local apenas pra capturar os dados
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [birthDate, setBirthDate] = useState("");
    const [gender, setGender] = useState("");
    const genders = ["Mulher", "Homem", "Outros"]; // opcoes que vão ser renderizadas na tela

    // instancia do controller para realizar a logica de cadastro
    // funcao acionada pelo evento de submissao do formulario, envia os dados para o controller
    const controller = new CadastroController();
    async function handleSignUp() {
        console.log("handleSignUp chamado")
        
        const sucesso = await controller.registrar(
            name,
            email,
            password,
            confirmPassword,
            birthDate,
            gender
        );

        // caso ocorra tudo bem, navega para a tela de gostos.
        if (sucesso) {
            router.replace("/gostos")
        }
} 



    return (
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.select({ ios: "padding", android: "height" })}>
            <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
                <View style={styles.container}>
                    
                    <Text style={styles.title}>Crie sua conta</Text>

                    <View style={styles.form}>
                        <Input 
                            placeholder="Nome de usuário:" 
                            onChangeText={setName} 
                        />
                        <Input 
                            placeholder="E-mail:" 
                            keyboardType="email-address" 
                            onChangeText={setEmail} 
                        />

                        <Input 
                            placeholder="Senha:" 
                            secureTextEntry 
                            onChangeText={setPassword} 
                        />

                        <Input 
                            placeholder="Confirmação de senha:" 
                            secureTextEntry 
                            onChangeText={setConfirmPassword} 
                        />

                        <TextInputMask
                            type={'datetime'}
                            options={{format: 'DD/MM/YYYY'}}
                            value={birthDate}
                            onChangeText={text => setBirthDate(text)}
                            
                            customTextInput={Input}
                            customTextInputProps={{
                                placeholder: "Data de Nascimento (DD/MM/AAAA):",
                                keyboardType: "number-pad",
                                style: { fontSize: 16 }
                            }}
                        />
                        
                        <Text style={styles.label}>Gênero:</Text>
                        <View style={styles.genderContainer}>
                            {genders.map((item) => (
                                <TouchableOpacity 
                                    key={item}
                                    style={[
                                        styles.genderButton, 
                                        gender === item && styles.genderButtonActive
                                    ]}
                                    onPress={() => setGender(item)}
                                    activeOpacity={0.7}
                                >
                                    <Text style={[
                                        styles.genderText,
                                        gender === item && styles.genderTextActive
                                    ]}>
                                        {item}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                        <Text style={styles.regrasSenha}>A senha precisa conter pelo menos: {"\n"}Oito caracteres {"\n"}Uma letra maiúscula {"\n"}Uma letra minúscula {"\n"}Um número</Text>

                        <Button label="Criar conta" onPress={handleSignUp} />

                        <Divider />
                    </View>

                    <FooterLink linkLabel="Possue conta? Faça seu login!" href="/" 
                    />
                </View>
            </ScrollView> 
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#D4AA94",
        padding: 28,
        paddingTop: 60,
    },
    title: {
        fontFamily: "Poppins_700Bold",
        fontSize: 28,
        color: "#500903",
        textAlign: "center",
        marginBottom: 20,
    },
    form: {
        gap: 8,
    },
    label: {
        fontFamily: "RedHatDisplay_700Bold",
        color: "#6F1D1B",
        fontSize: 18,
        marginTop: 8,
    },
    genderContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        gap: 8,
        marginBottom: 7,
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
        backgroundColor: "#6F1D1B",
    },
    genderText: {
        fontFamily: "RedHatDisplay_500Medium",
        color: "#6F1D1B",
    },
    genderTextActive: {
        color: "#FFFFFF",
    },
    regrasSenha: {
        fontFamily: "RedHatDisplay_700Bold",
        color: "#6F1D1B",
        fontSize: 14,
    }
});
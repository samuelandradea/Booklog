import { Alert } from "react-native";
import { signIn } from "@/services/authService";

// class responsavel por gerenciar a logica da  autenticacao do usuario
// recebe os dados da View e retorna um booleano
export class LoginController {
    public async fazerLogin(email: string, senha: string): Promise<boolean> {
        // verificacao rapida antes de se comunicar com o banco de dados
        if(!email.trim() || !senha.trim()) {
            Alert.alert("Preencha os campos!n", "Preencha os campos corretamente para entrar.");
            return false;
        }

        try {
            // o controller delega o acesso para o authService
            await signIn(email, senha);
            console.log("Login realizado com sucesso");
            Alert.alert("Bem-vinda(o)", `Seja bem-vinda(o) ${email}`);
            return true;
        } catch (error: any) {
            // captura de falhas do serviço externo
            console.log("erro:", error);
            Alert.alert("Erro ao entrar", error.message);
            return false;
        }
    }
}
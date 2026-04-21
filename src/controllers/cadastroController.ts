import { UsuarioBuilder } from "@/builders/usuarioBuilder";
import { signUp } from "@/services/authService";
import { createUser } from "@/services/userService";
import { Alert } from "react-native";

export class CadastroController {
    
    public async registrar(nome: string, email: string, senha: string, confirmacaoSenha: string, dataNasc: string, genero: string): Promise<boolean> {
        
        // validacoes do cadastro
        if (!nome || !email || !senha || !confirmacaoSenha || !dataNasc || !genero) {
            Alert.alert("Atenção", "Por favor, preencha todos os campos.");
            return false;
        }

        if (senha !== confirmacaoSenha) {
            Alert.alert("Erro", "As senhas não coincidem.");
            return false;
        }

        try {
            // cria a conta no Firebase
            const userAuth = await signUp(email, senha);
            const uid = userAuth.uid;

            const builder = new UsuarioBuilder();
            const novoUsuario = builder
                .adicionarNome(nome)
                .adicionarEmail(email)
                .adicionarDataNascimento(dataNasc)
                .adicionarGenero(genero)
                .construir();

            console.log("objeto criado pelo Builder:", novoUsuario)
            // salva no banco de dados
            await createUser(uid, novoUsuario);

            return true;
        } 
        catch (error: any) {
            console.log("erro:", error);
            Alert.alert("Erro ao cadastrar", error.message);
            return false;
        }
    }
}
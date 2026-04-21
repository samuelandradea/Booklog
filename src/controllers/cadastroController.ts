import { UsuarioBuilder } from "@/builders/usuarioBuilder";
import { signUp } from "@/services/authService";
import { createUser } from "@/services/userService";
import { Alert } from "react-native";

// class responsavel pela logica que envolve o cadastro dos usuarios no banco de dados
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
            // comunicacao com a parte de autenticacao do Firebase
            const userAuth = await signUp(email, senha);
            const uid = userAuth.uid;

            // uso do builder do usuario para construir o usuario
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
            // retorna true pra view saber que o fluxo foi sucesso
            return true;
        } 
        catch (error: any) {
            // tratamento de erros
            console.log("erro:", error);
            Alert.alert("Erro ao cadastrar", error.message);
            return false;
        }
    }
}
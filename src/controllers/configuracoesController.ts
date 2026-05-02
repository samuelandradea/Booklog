import { UsuarioBuilder } from "@/builders/usuarioBuilder"
import { auth } from "@/lib/firebase"
import { getUser, updateUser } from "@/services/userService"
import { EmailAuthProvider, reauthenticateWithCredential, updateEmail, updatePassword } from "firebase/auth"

// dados que a tela exibe e permite editar
export type DadosPerfil = {
    nome: string
    email: string
    bio: string
    dataNascimento: string
    genero: string
    senha: string
}

export class ConfiguracoesController {

    // busca os dados atuais do usuario na API e os retorna para a tela
    public async carregarDados(uid: string): Promise<DadosPerfil | null> {
        try {
            const dados = await getUser(uid)
            return {
                nome: dados.name ?? "",
                email: dados.email ?? "",
                bio: dados.bio ?? "",
                dataNascimento: dados.birthDate ?? "",
                genero: dados.gender ?? "",
                senha: "",  // senha nunca e exibida, campo sempre comeca vazio
            }
        } catch (error) {
            console.log("Erro ao carregar dados:", error)
            return null
        }
    }

    // compara os dados originais com os editados e retorna os nomes dos campos alterados
    public detectarAlteracoes(original: DadosPerfil, editado: DadosPerfil): string[] {
        const alteracoes: string[] = []

        // mapeamento de chave tecnica para nome legivel na tela
        const rotulos: Record<keyof DadosPerfil, string> = {
            nome: "Nome de usuário",
            email: "Email",
            bio: "Bio",
            dataNascimento: "Data de Nascimento",
            genero: "Gênero",
            senha: "Senha",
        }

        // percorre cada campo e adiciona o rotulo na lista se o valor mudou
        for (const chave in rotulos) {
            const campo = chave as keyof DadosPerfil
            if (campo === "senha") {
                // senha e considerada alterada apenas se o usuario digitou algo
                if (editado.senha.trim()) {
                    alteracoes.push(rotulos[campo])
                }
            } else if (original[campo] !== editado[campo]) {
                alteracoes.push(rotulos[campo])
            }
        }

        return alteracoes
    }

    // reautentica o usuario e salva os dados alterados na API e no Firebase Auth
    public async salvarAlteracoes(
        uid: string,
        original: DadosPerfil,
        editado: DadosPerfil,
        senhaAtual: string
    ): Promise<boolean> {
        try {
            const user = auth.currentUser
            if (!user) throw new Error("Usuário não autenticado")

            // reautentica com a senha atual antes de qualquer alteracao sensivel
            const credencial = EmailAuthProvider.credential(user.email!, senhaAtual)
            await reauthenticateWithCredential(user, credencial)

            // usa o builder para montar apenas os campos que serao atualizados
            const builder = new UsuarioBuilder()
            builder
                .adicionarNome(editado.nome)
                .adicionarEmail(editado.email)
                .adicionarBio(editado.bio)
                .adicionarDataNascimento(editado.dataNascimento)
                .adicionarGenero(editado.genero)

            // atualiza email no Firebase Auth apenas se foi alterado
            if (editado.email !== original.email) {
                await updateEmail(user, editado.email)
            }

            // atualiza senha no Firebase Auth apenas se o usuario digitou uma nova
            if (editado.senha.trim()) {
                await updatePassword(user, editado.senha)
                builder.adicionarSenha(editado.senha)
            }

            const dadosAtualizados = builder.construir()

            // salva na API
            await updateUser(uid, dadosAtualizados)

            return true
        } catch (error) {
            console.log("Erro ao salvar alterações:", error)
            return false
        }
    }

    // reautentica e deleta a conta do usuario do Firebase Auth
    public async excluirConta(senhaAtual: string): Promise<boolean> {
        try {
            const { deleteUser, EmailAuthProvider, reauthenticateWithCredential } = await import("firebase/auth")
            const user = auth.currentUser
            if (!user) throw new Error("Usuário não autenticado")
            const credencial = EmailAuthProvider.credential(user.email!, senhaAtual)
            await reauthenticateWithCredential(user, credencial)
            await deleteUser(user)
            return true
        } catch (error) {
            console.log("Erro ao excluir conta:", error)
            return false
        }
    }
}
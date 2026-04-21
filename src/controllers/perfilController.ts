import { getUser } from "@/services/userService"
import { Alert } from "react-native"

export class PerfilController {
    // Busca os dados do usuário na API e retorna os campos necessários para a tela
    public async carregarPerfil(uid: string): Promise<{
        nome: string
        bio: string
    } | null> {
        try {
            // consulta a API com o uid do usuario autenticado
            const dados = await getUser(uid)
            return {
                nome: dados.name ?? "",
                bio: dados.bio ?? "",   // se não existir bio, retorna string vazia
            }
        } catch (error: any) {
            console.log("Erro ao carregar perfil:", error)
            Alert.alert("Erro", "Não foi possível carregar os dados do perfil.")
            return null
        }
    }
}
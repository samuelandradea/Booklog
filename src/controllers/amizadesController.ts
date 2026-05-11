import { auth } from "@/lib/firebase";
import { getFollowing, unfollowUser } from "@/services/userService";
import { Alert, Platform } from "react-native";
 
export type Amigo = {
  id: string;
  name: string;
};
 
export class AmizadesController {
  // retorna a lista de usuarios que o usuario autenticado segue
  public async carregarAmigos(): Promise<Amigo[]> {
    const uid = auth.currentUser?.uid;
    if (!uid) return [];
 
    try {
      const data = await getFollowing(uid);
      return data || [];
    } catch (err) {
      console.error("Erro ao carregar amigos:", err);
      return [];
    }
  }
 
  // exibe confirmacao e deixa de seguir o usuario caso confirmado
  // usa window.confirm na web pois Alert.alert nao funciona no browser
  public async removerAmigo(
    targetUid: string,
    nome: string,
    onSucesso: () => void
  ): Promise<void> {
    const uid = auth.currentUser?.uid;
    if (!uid) return;
 
    if (Platform.OS === "web") {
      const confirmado = window.confirm(`Deseja deixar de seguir ${nome}?`);
      if (!confirmado) return;
      try {
        await unfollowUser(uid, targetUid);
        onSucesso();
      } catch (err) {
        console.error("Erro ao deixar de seguir:", err);
        window.alert("Não foi possível deixar de seguir.");
      }
      return;
    }
 
    Alert.alert(
      "Deixar de seguir",
      `Deseja deixar de seguir ${nome}?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Confirmar",
          style: "destructive",
          onPress: async () => {
            try {
              await unfollowUser(uid, targetUid);
              onSucesso();
            } catch (err) {
              console.error("Erro ao deixar de seguir:", err);
              Alert.alert("Erro", "Não foi possível deixar de seguir.");
            }
          },
        },
      ]
    );
  }
}
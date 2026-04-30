import { Alert } from "react-native";
import { getUser, updateUser } from "@/services/userService";

export class GameficacaoController {
    private getDomingoDestaSemana(): string {
        const hoje = new Date();
        const domingo = new Date(hoje.setDate(hoje.getDate() - hoje.getDay()));
        return domingo.toISOString().split('T')[0];
    }


    public async carregarProgresso(uid: string) {
        try {
            const userData = await getUser(uid);
            const domingoAtual = this.getDomingoDestaSemana();
            const semanaSalvaNoBanco = userData.semanaSalva;
            const diasLidos = userData.diasLidosSemana || [];

            if (semanaSalvaNoBanco !== domingoAtual) {
                const dadosResetados = {
                    semanaSalva: domingoAtual,
                    diasLidosSemana: [],
                };
                
               
                await updateUser(uid, dadosResetados);
                
                return [];
            }

            
            return diasLidos;

        } catch (error) {
            console.error("Erro ao carregar progresso:", error);
            return [];
        }
    }


    public async marcarDiaComoLido(uid: string, diaDaSemana: number, diasJaLidos: number[], totalDiasHistorico: number = 0) {
        try {
            const novaListaDeDias = [...diasJaLidos, diaDaSemana];
            const domingoAtual = this.getDomingoDestaSemana();

            await updateUser(uid, {
                diasLidosSemana: novaListaDeDias,
                semanaSalva: domingoAtual,
                totalDiasLidos: totalDiasHistorico + 1
            });

            return novaListaDeDias; 
            
        } catch (error) {
            console.error("Erro ao salvar o dia:", error);
            Alert.alert("Erro", "Não foi possível salvar o seu progresso diário.");
            return diasJaLidos;
        }
    }
}
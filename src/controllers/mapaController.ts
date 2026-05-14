import { ILocation } from "../models/LocationModel";

const API_URL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:8000";

/**
 * Controller responsável por gerenciar os dados da Tela do Mapa.
 * Ele conecta a View (React Native) com a API Python (FastAPI).
 */
export class MapaController {
  /**
   * Busca todos os locais literários do backend.
   * Em produção real, este método enviaria a latitude/longitude do usuário
   * para trazer apenas os locais mais próximos (Raio de X km).
   */
  static async buscarLocais(): Promise<ILocation[]> {
    try {
      // Como você mencionou que o deploy já está no railway, 
      // podemos usar a URL base correta aqui. Se não tiver no .env, usamos o localhost fallback.
      const response = await fetch(`${API_URL}/locations`);
      
      if (!response.ok) {
        throw new Error(`Erro HTTP! status: ${response.status}`);
      }
      
      const locais: ILocation[] = await response.json();
      return locais;
    } catch (error) {
      console.error("Erro ao buscar locais do mapa:", error);
      // Retornar um array vazio ou jogar o erro para a tela tratar
      return [];
    }
  }

  /**
   * Envia os dados do formulário de Sugestão de Local para o Backend.
   */
  static async enviarSugestao(dadosSugestao: { nome: string, categoria: string, endereco: string, motivo: string }): Promise<boolean> {
    try {
      const response = await fetch(`${API_URL}/suggestions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dadosSugestao),
      });

      if (!response.ok) {
        throw new Error(`Erro ao enviar sugestão: ${response.status}`);
      }

      return true; // Retorna sucesso
    } catch (error) {
      console.error("Erro no envio da sugestão:", error);
      return false; // Retorna falha para a tela lidar (se quiser)
    }
  }
}

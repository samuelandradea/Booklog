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
   * MOCK: Função que simula o envio de uma sugestão para o backend.
   * Depois nós construiremos a rota oficial de 'suggestions' no Python.
   */
  static async enviarSugestaoMock(dadosSugestao: any): Promise<boolean> {
    console.log("=========================================");
    console.log("MOCK: Enviando sugestão para o backend...");
    console.log(dadosSugestao);
    console.log("=========================================");
    
    // Simula o delay de internet (1 segundo)
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    return true; // Retorna sucesso
  }
}

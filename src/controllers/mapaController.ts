import { ILocation } from "../models/LocationModel";

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
  static async buscarLocaisProximos(
    latitude: number,
    longitude: number,
    raioMetros: number = 2000
  ): Promise<ILocation[]> {
    try {
      const filtros = [
        'amenity=library',
        'amenity=cafe',
        'shop=books',
        'leisure=park',
      ].map(
        (tipo) => `node[${tipo}](around:${raioMetros},${latitude},${longitude});`
      ).join('\n');

      const query = `[out:json][timeout:25];(${filtros});out body;`;

      const response = await fetch('https://overpass-api.de/api/interpreter', {
        method: 'POST',
        body: query,
      });

      if (!response.ok) throw new Error(`Erro HTTP: ${response.status}`);

      const data = await response.json();
    
      return data.elements.map((el: any): ILocation => ({
        id: String(el.id),
        nome: el.tags?.name || 'Local sem nome',
        endereco: el.tags?.['addr:street'] || 'Endereço não disponível',
        latitude: el.lat,
        longitude: el.lon,
        tipo: el.tags?.amenity || el.tags?.shop || el.tags?.leisure || 'local',
        criadoPor: 'OpenStreetMap',
        dataCriacao: new Date().toISOString(),
      }));

    } catch (error) {
      console.error('Erro ao buscar locais:', error)
      return [];
    }
  }

  /**
   * Envia os dados do formulário de Sugestão de Local para o Backend.
   */
  static async enviarSugestao(dadosSugestao: { nome: string, categoria: string, endereco: string, motivo: string }): Promise<boolean> {
    try {
      const API_URL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:8000";
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
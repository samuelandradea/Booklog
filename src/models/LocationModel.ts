/**
 * Define a estrutura de um Ponto Literário retornado pelo banco de dados.
 */
export interface ILocation {
  id: string;
  nome: string;
  endereco: string;
  latitude: number;
  longitude: number;
  tipo: string;
  fotoUrl?: string;
  criadoPor: string;
  dataCriacao: string;
}

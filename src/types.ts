export interface Protocolo {
  id?: string;
  "Número Sequencial": string;
  "Data de Submissão": string | number;
  Status: string;
  Tipo?: string;
  Localidade?: string;
}

export type Unidade = 'sesc' | 'senac';

export interface DashboardStats {
  total: number;
  open: number;
  late: number;
  efficiency: string;
  statusData: { name: string; value: number }[];
  slaData: { name: string; value: number }[];
}

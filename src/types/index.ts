export interface Simulation {
  id: string;
  propertyValue: number;
  downPayment: number;
  financedAmount: number;
  monthlyPayment: number;
  clientName?: string;
  timestamp: Date;
  status: 'simulated' | 'accepted';
}

export type Section = 'form' | 'result' | 'admin';

export interface FormData {
  propertyValue: string;
  downPayment: string;
}

export interface FormErrors {
  propertyValue?: string;
  downPayment?: string;
}

export interface ApiSimulation {
  id: number;
  nome_assinante: string;
  valor_imovel: string;
  entrada: string;
  valor_financiado: string;
  valor_parcela: string;
  created_at: string;
  pdf_url: string;
}

export interface AdminApiResponse {
  totalSimulacoes: number;
  propostasAceitas: number;
  totalFinanciado: number;
  parcelaMedia: number;
  simulacoes: ApiSimulation[];
}
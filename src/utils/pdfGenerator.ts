import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { SimulationData } from './calculations';
import { formatDate } from './formatters';

export interface ProposalData extends SimulationData {
  clientName: string;
  timestamp: Date;
}

export const generateProposalPDF = async (data: ProposalData): Promise<void> => {
  const pdf = new jsPDF();
  
  // Configuração do documento
  pdf.setFontSize(20);
  pdf.setTextColor(40, 40, 40);
  pdf.text('Proposta de Financiamento Imobiliário', 20, 30);
  
  // Linha separadora
  pdf.setLineWidth(0.5);
  pdf.setDrawColor(40, 199, 111); // Verde Kiwify
  pdf.line(20, 35, 190, 35);
  
  // Dados do cliente
  pdf.setFontSize(14);
  pdf.setTextColor(40, 40, 40);
  pdf.text('Dados do Cliente:', 20, 50);
  
  pdf.setFontSize(12);
  pdf.text(`Nome: ${data.clientName}`, 20, 60);
  pdf.text(`Data: ${formatDate(data.timestamp)}`, 20, 70);
  
  // Dados da simulação
  pdf.setFontSize(14);
  pdf.text('Dados da Simulação:', 20, 90);
  
  pdf.setFontSize(12);
  const propertyValueText = `Valor do Imóvel: ${new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(data.propertyValue)}`;
  
  const downPaymentText = `Valor de Entrada: ${new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(data.downPayment)}`;
  
  const financedAmountText = `Valor Financiado: ${new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(data.financedAmount)}`;
  
  const monthlyPaymentText = `Parcela Mensal: ${new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(data.monthlyPayment)}`;
  
  const interestRateText = `Taxa de Juros: ${(data.interestRate * 100).toFixed(2)}% ao ano`;
  const termText = `Prazo: ${data.termYears} anos`;
  
  pdf.text(propertyValueText, 20, 100);
  pdf.text(downPaymentText, 20, 110);
  pdf.text(financedAmountText, 20, 120);
  pdf.text(monthlyPaymentText, 20, 130);
  pdf.text(interestRateText, 20, 140);
  pdf.text(termText, 20, 150);
  
  // Observações
  pdf.setFontSize(10);
  pdf.setTextColor(80, 80, 80);
  pdf.text('* Esta proposta é válida por 30 dias.', 20, 170);
  pdf.text('* Sujeita à análise de crédito.', 20, 180);
  pdf.text('* Taxa de juros baseada no sistema Price.', 20, 190);
  
  // Assinatura digital
  pdf.setFontSize(12);
  pdf.setTextColor(40, 40, 40);
  pdf.text('Assinatura Digital:', 20, 210);
  pdf.text(`${data.clientName}`, 20, 220);
  pdf.text(`Aceito em: ${formatDate(data.timestamp)}`, 20, 230);
  
  // Download do PDF
  const fileName = `proposta-financiamento-${data.clientName.replace(/\s+/g, '-').toLowerCase()}-${Date.now()}.pdf`;
  pdf.save(fileName);
};
import React, { useState } from 'react';
import { CheckCircle, Download, ArrowLeft, User, FileCheck } from 'lucide-react';
import { Simulation } from '../types';
import { generateProposalPDF } from '../utils/pdfGenerator';

interface SimulationResultProps {
  simulation: Simulation;
  onBack: () => void;
  onAccept: (simulation: Simulation) => void;
}

export const SimulationResult: React.FC<SimulationResultProps> = ({
  simulation,
  onBack,
  onAccept,
}) => {
  const [showAcceptForm, setShowAcceptForm] = useState(false);
  const [clientName, setClientName] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const handleAcceptProposal = () => {
    if (!clientName.trim()) {
      alert('Por favor, informe seu nome completo');
      return;
    }
    
    if (!agreedToTerms) {
      alert('Por favor, aceite os termos da proposta');
      return;
    }

    setShowAcceptForm(false);
    setIsGeneratingPDF(true);

    const proposalData = {
      ...simulation,
      clientName: clientName.trim(),
      timestamp: new Date(),
    };

    // Envia dados para o webhook
    const webhookData = {
      clientName: clientName.trim(),
      propertyValue: simulation.propertyValue,
      downPayment: simulation.downPayment,
      financedAmount: simulation.financedAmount,
      monthlyPayment: simulation.monthlyPayment,
      interestRate: simulation.interestRate,
      termYears: simulation.termYears,
      timestamp: new Date().toISOString(),
    };

    // Envia requisição POST para o webhook
    fetch('https://kiwify-n8n.12zlr4.easypanel.host/webhook/admin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(webhookData),
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      console.log('Webhook enviado com sucesso:', data);
    })
    .catch(error => {
      console.error('Erro ao enviar webhook:', error);
      // Continua o processo mesmo se o webhook falhar
    });

    // Gera PDF e força download
    generateProposalPDF(proposalData)
      .then(() => {
        // Atualiza simulação com dados do cliente
        const updatedSimulation: Simulation = {
          ...simulation,
          clientName: clientName.trim(),
          status: 'accepted',
          timestamp: new Date(),
        };
        
        onAccept(updatedSimulation);
      })
      .catch((error) => {
        console.error('Erro ao gerar PDF:', error);
        alert('Erro ao gerar PDF. Tente novamente.');
      })
      .finally(() => {
        setIsGeneratingPDF(false);
      });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[#28C76F] rounded-full mb-6">
            <CheckCircle className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-[#1E1E1E] mb-4">
            Simulação Concluída
          </h1>
          <p className="text-lg text-gray-600">
            Confira os detalhes da sua proposta de financiamento
          </p>
        </div>

        {/* Resultado da Simulação */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Status */}
          <div className="bg-[#28C76F] px-8 py-6">
            <div className="flex items-center justify-between text-white">
              <div>
                <h2 className="text-2xl font-bold">Proposta Aprovada</h2>
                <p className="text-green-100">Dados calculados com sucesso</p>
              </div>
              <CheckCircle className="w-12 h-12" />
            </div>
          </div>

          {/* Detalhes */}
          <div className="p-8">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Valores Principais */}
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-[#1E1E1E] border-b-2 border-[#28C76F] pb-2">
                  Valores da Proposta
                </h3>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
                    <span className="font-semibold text-gray-700">Valor do Imóvel:</span>
                    <span className="text-xl font-bold text-[#1E1E1E]">
                      {formatCurrency(simulation.propertyValue)}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center p-4 bg-blue-50 rounded-xl">
                    <span className="font-semibold text-blue-700">Valor de Entrada:</span>
                    <span className="text-xl font-bold text-blue-800">
                      {formatCurrency(simulation.downPayment)}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center p-4 bg-orange-50 rounded-xl">
                    <span className="font-semibold text-orange-700">Valor Financiado:</span>
                    <span className="text-xl font-bold text-orange-800">
                      {formatCurrency(simulation.financedAmount)}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center p-4 bg-[#28C76F] bg-opacity-10 rounded-xl border-2 border-[#28C76F] border-opacity-30">
                    <span className="font-semibold text-[#1E1E1E]">Parcela Mensal:</span>
                    <span className="text-2xl font-bold text-[#28C76F]">
                      {formatCurrency(simulation.monthlyPayment)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Informações do Financiamento */}
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-[#1E1E1E] border-b-2 border-[#28C76F] pb-2">
                  Condições do Financiamento
                </h3>
                
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-semibold text-gray-700">Taxa de Juros:</span>
                      <span className="font-bold text-[#1E1E1E]">12% ao ano</span>
                    </div>
                    <div className="text-sm text-gray-600">Sistema Price (amortização)</div>
                  </div>
                  
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-semibold text-gray-700">Prazo:</span>
                      <span className="font-bold text-[#1E1E1E]">30 anos</span>
                    </div>
                    <div className="text-sm text-gray-600">360 parcelas mensais</div>
                  </div>
                  
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-semibold text-gray-700">Percentual de Entrada:</span>
                      <span className="font-bold text-[#1E1E1E]">
                        {((simulation.downPayment / simulation.propertyValue) * 100).toFixed(1)}%
                      </span>
                    </div>
                    <div className="text-sm text-gray-600">Acima do mínimo exigido</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Ações */}
            <div className="mt-8 pt-8 border-t border-gray-200">
              {!showAcceptForm ? (
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={onBack}
                    className="flex items-center justify-center space-x-2 px-8 py-4 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all duration-200"
                  >
                    <ArrowLeft className="w-5 h-5" />
                    <span>Nova Simulação</span>
                  </button>
                  
                  <button
                    onClick={() => setShowAcceptForm(true)}
                    className="flex items-center justify-center space-x-2 px-8 py-4 bg-[#28C76F] hover:bg-[#34D57B] text-white font-bold rounded-xl transition-all duration-200 transform hover:scale-[1.02] hover:shadow-lg"
                  >
                    <FileCheck className="w-5 h-5" />
                    <span>Aceitar Proposta</span>
                  </button>
                </div>
              ) : (
                /* Formulário de Aceite */
                <div className="bg-gray-50 rounded-xl p-6">
                  <h4 className="text-xl font-bold text-[#1E1E1E] mb-6 text-center">
                    Finalizar Proposta
                  </h4>
                  
                  <div className="space-y-4 max-w-md mx-auto">
                    <div>
                      <label className="block text-sm font-semibold text-[#1E1E1E] mb-2">
                        Nome Completo
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <User className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="text"
                          value={clientName}
                          onChange={(e) => setClientName(e.target.value)}
                          className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#28C76F] focus:ring-2 focus:ring-[#28C76F] focus:ring-opacity-20 focus:outline-none"
                          placeholder="Digite seu nome completo"
                        />
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <input
                        type="checkbox"
                        id="terms"
                        checked={agreedToTerms}
                        onChange={(e) => setAgreedToTerms(e.target.checked)}
                        className="mt-1 w-5 h-5 text-[#28C76F] border-2 border-gray-300 rounded focus:ring-[#28C76F] focus:ring-2"
                      />
                      <label htmlFor="terms" className="text-sm text-gray-700">
                        Concordo com os termos da proposta e autorizo a geração do documento.
                        Esta assinatura digital tem valor legal para esta simulação.
                      </label>
                    </div>
                    
                    <div className="flex space-x-3 pt-4">
                      <button
                        onClick={() => setShowAcceptForm(false)}
                        className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all duration-200"
                      >
                        Cancelar
                      </button>
                      
                      <button
                        onClick={handleAcceptProposal}
                        disabled={isGeneratingPDF}
                        className="flex-1 bg-[#28C76F] hover:bg-[#34D57B] disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold px-4 py-3 rounded-xl transition-all duration-200 flex items-center justify-center space-x-2"
                      >
                        {isGeneratingPDF ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            <span>Gerando PDF...</span>
                          </>
                        ) : (
                          <>
                            <Download className="w-4 h-4" />
                            <span>Confirmar</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Observações */}
        <div className="mt-8 bg-white rounded-xl p-6 shadow-lg">
          <h4 className="font-bold text-[#1E1E1E] mb-3">Observações Importantes:</h4>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>• Esta simulação é válida por 30 dias a partir da data de geração</li>
            <li>• Os valores estão sujeitos à análise de crédito e aprovação</li>
            <li>• A taxa de juros pode variar conforme o perfil do cliente</li>
            <li>• Documentação completa será solicitada para formalização</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
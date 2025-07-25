import React, { useState, useEffect } from 'react';
import { Users, FileText, TrendingUp, ArrowLeft, Search, Filter, Download, AlertCircle, RefreshCw } from 'lucide-react';
import { AdminApiResponse, ApiSimulation } from '../types';
import { formatDate } from '../utils/formatters';

interface AdminPanelProps {
  onBack: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ onBack }) => {
  const [data, setData] = useState<AdminApiResponse | null>(null);
  const [filteredSimulations, setFilteredSimulations] = useState<ApiSimulation[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'accepted'>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const fetchAdminData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('https://kiwify-n8n.12zlr4.easypanel.host/webhook/admin');
      
      if (!response.ok) {
        throw new Error(`Erro ${response.status}: ${response.statusText}`);
      }
      
      const apiResponse = await response.json();
      // A API retorna um array com um objeto
      const apiData: AdminApiResponse = Array.isArray(apiResponse) ? apiResponse[0] : apiResponse;
      setData(apiData);
      setFilteredSimulations(apiData.simulacoes);
    } catch (err) {
      console.error('Erro ao carregar dados:', err);
      setError(err instanceof Error ? err.message : 'Erro desconhecido ao carregar dados');
    } finally {
      setIsLoading(false);
    }
  };

  // Carrega dados ao montar o componente
  useEffect(() => {
    fetchAdminData();
  }, []);

  // Filtros e busca
  useEffect(() => {
    if (!data) return;
    
    let filtered = data.simulacoes;

    // Filtro por status (todas são aceitas neste caso, mas mantemos a estrutura)
    if (statusFilter === 'accepted') {
      filtered = filtered.filter(() => true); // Todas são aceitas
    }

    // Busca por nome
    if (searchTerm) {
      filtered = filtered.filter(sim => 
        sim.nome_assinante.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredSimulations(filtered);
  }, [data, searchTerm, statusFilter]);

  const handleDownloadPDF = (pdfUrl: string, clientName: string) => {
    // Abre o PDF em nova aba
    window.open(pdfUrl, '_blank');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[#28C76F] rounded-full mb-6">
            <RefreshCw className="w-8 h-8 text-white animate-spin" />
          </div>
          <h2 className="text-2xl font-bold text-[#1E1E1E] mb-2">Carregando dados...</h2>
          <p className="text-gray-600">Aguarde enquanto buscamos as informações</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-6">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-[#1E1E1E] mb-4">Erro ao carregar dados</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={fetchAdminData}
                className="flex items-center justify-center space-x-2 px-6 py-3 bg-[#28C76F] hover:bg-[#34D57B] text-white font-semibold rounded-xl transition-all duration-200"
              >
                <RefreshCw className="w-5 h-5" />
                <span>Tentar Novamente</span>
              </button>
              <button
                onClick={onBack}
                className="flex items-center justify-center space-x-2 px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all duration-200"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Voltar</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-12">
          <div className="flex-1">
            <h1 className="text-4xl font-bold text-[#1E1E1E] mb-4">
              Painel Administrativo
            </h1>
            <p className="text-lg text-gray-600">
              Gerencie todas as simulações de financiamento
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:space-x-4 sm:gap-0">
            <button
              onClick={fetchAdminData}
              className="flex items-center justify-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-all duration-200"
              title="Atualizar dados"
            >
              <RefreshCw className="w-5 h-5" />
              <span>Atualizar</span>
            </button>
            
            <button
              onClick={onBack}
              className="flex items-center justify-center space-x-2 px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all duration-200"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Voltar</span>
            </button>
          </div>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600">Total de Simulações</p>
                <p className="text-3xl font-bold text-[#1E1E1E]">{data.totalSimulacoes}</p>
              </div>
              <FileText className="w-8 h-8 text-[#28C76F]" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600">Propostas Aceitas</p>
                <p className="text-3xl font-bold text-[#28C76F]">{data.propostasAceitas}</p>
              </div>
              <Users className="w-8 h-8 text-[#28C76F]" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600">Total Financiado</p>
                <p className="text-xl font-bold text-[#1E1E1E]">
                  {formatCurrency(data.totalFinanciado)}
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-[#28C76F]" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600">Parcela Média</p>
                <p className="text-xl font-bold text-[#1E1E1E]">
                  {formatCurrency(data.parcelaMedia)}
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-[#28C76F]" />
            </div>
          </div>
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-xl p-6 shadow-lg mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Busca */}
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#28C76F] focus:ring-2 focus:ring-[#28C76F] focus:ring-opacity-20 focus:outline-none"
                placeholder="Buscar por nome do cliente..."
              />
            </div>
            
            {/* Filtro de Status */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Filter className="h-5 w-5 text-gray-400" />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="pl-10 pr-8 py-3 border-2 border-gray-200 rounded-xl focus:border-[#28C76F] focus:ring-2 focus:ring-[#28C76F] focus:ring-opacity-20 focus:outline-none appearance-none bg-white"
              >
                <option value="all">Todos os Status</option>
                <option value="accepted">Propostas Aceitas</option>
              </select>
            </div>
          </div>
        </div>

        {/* Tabela */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-xl font-bold text-[#1E1E1E]">
              Simulações ({filteredSimulations.length})
            </h3>
          </div>
          
          {filteredSimulations.length === 0 ? (
            <div className="p-12 text-center">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h4 className="text-xl font-semibold text-gray-500 mb-2">
                Nenhuma simulação encontrada
              </h4>
              <p className="text-gray-400">
                {data.simulacoes.length === 0 
                  ? 'Ainda não há simulações realizadas'
                  : 'Tente ajustar os filtros de busca'
                }
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Nome do Assinante</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Valor do Imóvel</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Entrada</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Valor Financiado</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Parcela Mensal</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Data</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">PDF</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredSimulations.map((simulation) => (
                    <tr key={simulation.id} className="hover:bg-gray-50 transition-colors duration-150">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-[#1E1E1E]">
                          {simulation.nome_assinante}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {formatCurrency(parseFloat(simulation.valor_imovel))}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 font-medium">
                        {formatCurrency(parseFloat(simulation.entrada))}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-orange-600 font-medium">
                        {formatCurrency(parseFloat(simulation.valor_financiado))}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-[#28C76F]">
                        {formatCurrency(parseFloat(simulation.valor_parcela))}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(new Date(simulation.created_at))}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {simulation.pdf_url ? (
                          <button
                            onClick={() => handleDownloadPDF(simulation.pdf_url, simulation.nome_assinante)}
                            className="flex items-center space-x-1 px-3 py-2 bg-[#28C76F] hover:bg-[#34D57B] text-white text-sm font-semibold rounded-lg transition-all duration-200"
                            title="Baixar PDF"
                          >
                            <Download className="w-4 h-4" />
                            <span className="hidden sm:inline">PDF</span>
                          </button>
                        ) : (
                          <span className="text-gray-400 text-sm">Sem PDF</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
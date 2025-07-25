import React, { useState } from 'react';
import { Calculator, DollarSign, AlertCircle } from 'lucide-react';
import { formatCurrency, parseCurrency } from '../utils/formatters';
import { validateDownPayment, calculateFinancing } from '../utils/calculations';
import { FormData, FormErrors, Simulation } from '../types';

interface SimulationFormProps {
  onSimulate: (simulation: Simulation) => void;
}

export const SimulationForm: React.FC<SimulationFormProps> = ({ onSimulate }) => {
  const [formData, setFormData] = useState<FormData>({
    propertyValue: '',
    downPayment: '',
  });
  
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field: keyof FormData, value: string) => {
    const formattedValue = formatCurrency(value);
    setFormData(prev => ({ ...prev, [field]: formattedValue }));
    
    // Limpa erro ao digitar
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    const propertyValue = parseCurrency(formData.propertyValue);
    const downPayment = parseCurrency(formData.downPayment);

    // Validação valor do imóvel
    if (!propertyValue || propertyValue <= 0) {
      newErrors.propertyValue = 'Valor do imóvel é obrigatório';
    } else if (propertyValue < 50000) {
      newErrors.propertyValue = 'Valor mínimo de R$ 50.000,00';
    }

    // Validação entrada
    if (!downPayment || downPayment <= 0) {
      newErrors.downPayment = 'Valor de entrada é obrigatório';
    } else if (propertyValue > 0) {
      const validation = validateDownPayment(propertyValue, downPayment);
      if (!validation.isValid) {
        newErrors.downPayment = validation.message;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    // Simula processamento
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const propertyValue = parseCurrency(formData.propertyValue);
    const downPayment = parseCurrency(formData.downPayment);
    
    const calculation = calculateFinancing(propertyValue, downPayment);
    
    const simulation: Simulation = {
      id: Date.now().toString(),
      ...calculation,
      timestamp: new Date(),
      status: 'simulated',
    };
    
    setIsLoading(false);
    onSimulate(simulation);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[#28C76F] rounded-full mb-6">
            <Calculator className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-[#1E1E1E] mb-4">
            Simulador de Financiamento
          </h1>
          <p className="text-lg text-gray-600 max-w-md mx-auto">
            Simule seu financiamento imobiliário de forma rápida e segura
          </p>
        </div>

        {/* Formulário */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Valor do Imóvel */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-[#1E1E1E]">
                Valor do Imóvel
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <DollarSign className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={formData.propertyValue}
                  onChange={(e) => handleInputChange('propertyValue', e.target.value)}
                  className={`w-full pl-12 pr-4 py-4 border-2 rounded-xl text-lg font-medium transition-all duration-200 ${
                    errors.propertyValue
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                      : 'border-gray-200 focus:border-[#28C76F] focus:ring-[#28C76F]'
                  } focus:ring-2 focus:ring-opacity-20 focus:outline-none`}
                  placeholder="R$ 0,00"
                />
              </div>
              {errors.propertyValue && (
                <div className="flex items-center space-x-2 text-red-600">
                  <AlertCircle className="w-4 h-4" />
                  <span className="text-sm">{errors.propertyValue}</span>
                </div>
              )}
            </div>

            {/* Valor de Entrada */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-[#1E1E1E]">
                Valor de Entrada <span className="text-gray-500">(mínimo 20%)</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <DollarSign className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={formData.downPayment}
                  onChange={(e) => handleInputChange('downPayment', e.target.value)}
                  className={`w-full pl-12 pr-4 py-4 border-2 rounded-xl text-lg font-medium transition-all duration-200 ${
                    errors.downPayment
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                      : 'border-gray-200 focus:border-[#28C76F] focus:ring-[#28C76F]'
                  } focus:ring-2 focus:ring-opacity-20 focus:outline-none`}
                  placeholder="R$ 0,00"
                />
              </div>
              {errors.downPayment && (
                <div className="flex items-center space-x-2 text-red-600">
                  <AlertCircle className="w-4 h-4" />
                  <span className="text-sm">{errors.downPayment}</span>
                </div>
              )}
            </div>

            {/* Botão Simular */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#28C76F] hover:bg-[#34D57B] disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold py-4 px-8 rounded-xl text-lg transition-all duration-200 transform hover:scale-[1.02] hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-[#28C76F] focus:ring-opacity-30"
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Simulando...</span>
                </div>
              ) : (
                'Simular Proposta'
              )}
            </button>
          </form>

          {/* Informações adicionais */}
          <div className="mt-8 p-4 bg-gray-50 rounded-xl">
            <h3 className="font-semibold text-[#1E1E1E] mb-2">Informações Importantes:</h3>
            <ul className="space-y-1 text-sm text-gray-600">
              <li>• Taxa de juros: 12% ao ano (sistema Price)</li>
              <li>• Prazo padrão: 30 anos</li>
              <li>• Entrada mínima: 20% do valor do imóvel</li>
              <li>• Simulação sujeita à análise de crédito</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
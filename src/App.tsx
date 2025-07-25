import React, { useState } from 'react';
import { Settings } from 'lucide-react';
import { SimulationForm } from './components/SimulationForm';
import { SimulationResult } from './components/SimulationResult';
import { AdminPanel } from './components/AdminPanel';
import { Section, Simulation } from './types';

function App() {
  const [currentSection, setCurrentSection] = useState<Section>('form');
  const [currentSimulation, setCurrentSimulation] = useState<Simulation | null>(null);
  const [simulations, setSimulations] = useState<Simulation[]>([]);

  const handleSimulate = (simulation: Simulation) => {
    setCurrentSimulation(simulation);
    setCurrentSection('result');
  };

  const handleAcceptProposal = (simulation: Simulation) => {
    // Adiciona ou atualiza simulação na lista
    setSimulations(prev => {
      const existingIndex = prev.findIndex(s => s.id === simulation.id);
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = simulation;
        return updated;
      }
      return [...prev, simulation];
    });

    // Volta para o formulário após aceitar
    setCurrentSection('form');
    setCurrentSimulation(null);
    
    // Mostra mensagem de sucesso
    alert('Proposta aceita com sucesso! PDF gerado e salvo.');
  };

  const handleBackToForm = () => {
    setCurrentSection('form');
    setCurrentSimulation(null);
  };

  const handleShowAdmin = () => {
    setCurrentSection('admin');
  };

  const handleBackFromAdmin = () => {
    setCurrentSection('form');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Botão Admin (fixo no canto superior direito) */}
      {currentSection === 'form' && (
        <div className="fixed top-6 right-6 z-50">
          <button
            onClick={handleShowAdmin}
            className="flex items-center space-x-2 px-4 py-2 bg-[#1E1E1E] text-white font-semibold rounded-xl hover:bg-gray-800 transition-all duration-200 shadow-lg"
            title="Painel Administrativo"
          >
            <Settings className="w-5 h-5" />
            <span className="hidden sm:inline">Admin</span>
            {simulations.length > 0 && (
              <span className="bg-[#28C76F] text-white text-xs font-bold px-2 py-1 rounded-full">
                {simulations.length}
              </span>
            )}
          </button>
        </div>
      )}

      {/* Renderização Condicional das Seções */}
      {currentSection === 'form' && (
        <SimulationForm onSimulate={handleSimulate} />
      )}

      {currentSection === 'result' && currentSimulation && (
        <SimulationResult
          simulation={currentSimulation}
          onBack={handleBackToForm}
          onAccept={handleAcceptProposal}
        />
      )}

      {currentSection === 'admin' && (
        <AdminPanel onBack={handleBackFromAdmin} />
      )}
    </div>
  );
}

export default App;
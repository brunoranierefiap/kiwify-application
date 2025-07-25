// Utilitários para cálculos financeiros
export interface SimulationData {
  propertyValue: number;
  downPayment: number;
  financedAmount: number;
  monthlyPayment: number;
  interestRate: number;
  termYears: number;
}

export const calculateFinancing = (
  propertyValue: number,
  downPayment: number,
  termYears: number = 30,
  annualRate: number = 0.12
): SimulationData => {
  const financedAmount = propertyValue - downPayment;
  const monthlyRate = annualRate / 12;
  const totalPayments = termYears * 12;
  
  // Fórmula de amortização constante (Price)
  const monthlyPayment = financedAmount * 
    (monthlyRate * Math.pow(1 + monthlyRate, totalPayments)) /
    (Math.pow(1 + monthlyRate, totalPayments) - 1);

  return {
    propertyValue,
    downPayment,
    financedAmount,
    monthlyPayment,
    interestRate: annualRate,
    termYears,
  };
};

export const validateDownPayment = (
  propertyValue: number,
  downPayment: number
): { isValid: boolean; message?: string } => {
  const minimumDown = propertyValue * 0.2;
  
  if (downPayment < minimumDown) {
    return {
      isValid: false,
      message: `Entrada mínima de 20% (${new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      }).format(minimumDown)})`
    };
  }
  
  if (downPayment >= propertyValue) {
    return {
      isValid: false,
      message: 'Entrada deve ser menor que o valor do imóvel'
    };
  }
  
  return { isValid: true };
};
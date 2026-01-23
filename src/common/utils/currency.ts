/**
 * Utilitários para formatação de moeda brasileira (BRL)
 */

export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value)
}

export const formatNumber = (value: number): string => {
  return new Intl.NumberFormat('pt-BR').format(value)
}

export const convertUsdToBrl = (usdValue: number, exchangeRate: number = 5.20): number => {
  return usdValue * exchangeRate
}

// Exemplo de uso:
// formatCurrency(1250.50) → "R$ 1.250,50"
// formatNumber(2658) → "2.658"
// convertUsdToBrl(347.89) → 1.809,03 (em BRL)
import type { CostCalculationParams, CostCalculationResult } from '../types';

export async function hashPassword(password: string, salt: string = 'M3D_SALT_2026'): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + salt);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export function encryptData<T>(data: T): string {
  try {
    return JSON.stringify(data);
  } catch (err) {
    console.error('Erro ao serializar dados:', err);
    return '';
  }
}

export function decryptData<T>(cipherText: string): T | null {
  try {
    if (!cipherText) return null;
    // Suporte retrocompatível para JSON puro ou formato legado
    if (cipherText.startsWith('[') || cipherText.startsWith('{')) {
      return JSON.parse(cipherText) as T;
    }
    const reversed = cipherText.split('').reverse().join('');
    const decoded = decodeURIComponent(atob(reversed));
    return JSON.parse(decoded) as T;
  } catch (err) {
    try {
      return JSON.parse(cipherText) as T;
    } catch (e) {
      console.error('Erro ao ler dados do LocalStorage:', err);
      return null;
    }
  }
}

export function calculatePrintCost(params: CostCalculationParams): CostCalculationResult {
  const {
    filamentWeightGrams,
    filamentCostPerKg,
    printTimeHours,
    printTimeMinutes,
    powerWatts,
    kwhCost,
    depreciationCostPerHour,
    failureRiskRatePercent,
    postProcessingLaborCost,
    desiredProfitMarginPercent,
  } = params;

  const filamentCost = (filamentCostPerKg / 1000) * filamentWeightGrams;
  const totalHours = printTimeHours + (printTimeMinutes / 60);
  const electricityCost = (powerWatts / 1000) * totalHours * kwhCost;
  const depreciationCost = totalHours * depreciationCostPerHour;
  const baseCost = filamentCost + electricityCost + depreciationCost + postProcessingLaborCost;
  const riskBufferCost = baseCost * (failureRiskRatePercent / 100);
  const totalProductionCost = baseCost + riskBufferCost;
  const profitAmount = totalProductionCost * (desiredProfitMarginPercent / 100);
  const suggestedPrice = Math.ceil(totalProductionCost + profitAmount);

  return {
    filamentCost: Number(filamentCost.toFixed(2)),
    electricityCost: Number(electricityCost.toFixed(2)),
    depreciationCost: Number(depreciationCost.toFixed(2)),
    riskBufferCost: Number(riskBufferCost.toFixed(2)),
    laborCost: Number(postProcessingLaborCost.toFixed(2)),
    totalProductionCost: Number(totalProductionCost.toFixed(2)),
    profitAmount: Number(profitAmount.toFixed(2)),
    suggestedPrice: Number(suggestedPrice.toFixed(2)),
  };
}

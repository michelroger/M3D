import React, { useState } from 'react';
import type { CostCalculationParams, Product } from '../types';
import { calculatePrintCost } from '../services/security';
import { X, Calculator, DollarSign, Clock } from 'lucide-react';
import confetti from 'canvas-confetti';

interface CostCalculatorProps {
  isOpen: boolean;
  onClose: () => void;
  products?: Product[];
  onApplyPriceToProduct?: (productId: string, price: number) => void;
}

export const CostCalculator: React.FC<CostCalculatorProps> = ({
  isOpen,
  onClose,
  products = [],
  onApplyPriceToProduct,
}) => {
  if (!isOpen) return null;

  const [params, setParams] = useState<CostCalculationParams>({
    filamentWeightGrams: 150,
    filamentCostPerKg: 120,
    printTimeHours: 6,
    printTimeMinutes: 30,
    powerWatts: 150,
    kwhCost: 0.95,
    depreciationCostPerHour: 1.5,
    failureRiskRatePercent: 10,
    postProcessingLaborCost: 15,
    desiredProfitMarginPercent: 100,
  });

  const [selectedProductId, setSelectedProductId] = useState<string>('');

  const result = calculatePrintCost(params);

  const handleApplyToProduct = () => {
    if (selectedProductId && onApplyPriceToProduct) {
      onApplyPriceToProduct(selectedProductId, result.suggestedPrice);
      confetti({ particleCount: 50, spread: 70 });
      alert(`Preço de R$ ${result.suggestedPrice.toFixed(2)} aplicado ao produto selecionado!`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col">
        
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950">
          <div className="flex items-center gap-2">
            <Calculator className="w-5 h-5 text-cyan-400" />
            <div>
              <h2 className="text-base font-bold text-white">Calculadora Interna de Custos 3D</h2>
              <p className="text-[11px] text-slate-400 font-mono">Precificação precisa baseada em filamento, energia e margem de lucro</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto grid grid-cols-1 md:grid-cols-12 gap-6">
          
          <div className="md:col-span-7 space-y-4 text-xs">
            
            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
              <span className="font-mono text-orange-400 font-bold flex items-center gap-1.5">
                🧵 1. Consumo de Filamento
              </span>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Peso da Peça (g):</label>
                  <input
                    type="number"
                    value={params.filamentWeightGrams}
                    onChange={(e) => setParams({ ...params, filamentWeightGrams: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-slate-900 text-white p-2 rounded-xl border border-slate-800 font-mono text-center focus:border-orange-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Custo/kg Filamento (R$):</label>
                  <input
                    type="number"
                    value={params.filamentCostPerKg}
                    onChange={(e) => setParams({ ...params, filamentCostPerKg: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-slate-900 text-white p-2 rounded-xl border border-slate-800 font-mono text-center focus:border-orange-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
              <span className="font-mono text-cyan-400 font-bold flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" /> 2. Tempo de Impressão & Energia
              </span>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-slate-400 mb-1">Horas:</label>
                  <input
                    type="number"
                    value={params.printTimeHours}
                    onChange={(e) => setParams({ ...params, printTimeHours: parseInt(e.target.value) || 0 })}
                    className="w-full bg-slate-900 text-white p-2 rounded-xl border border-slate-800 font-mono text-center focus:border-cyan-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Minutos:</label>
                  <input
                    type="number"
                    value={params.printTimeMinutes}
                    onChange={(e) => setParams({ ...params, printTimeMinutes: parseInt(e.target.value) || 0 })}
                    className="w-full bg-slate-900 text-white p-2 rounded-xl border border-slate-800 font-mono text-center focus:border-cyan-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Watts (W):</label>
                  <input
                    type="number"
                    value={params.powerWatts}
                    onChange={(e) => setParams({ ...params, powerWatts: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-slate-900 text-white p-2 rounded-xl border border-slate-800 font-mono text-center focus:border-cyan-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
              <span className="font-mono text-emerald-400 font-bold flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5" /> 3. Manutenção & Margem de Lucro
              </span>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Risco / Perda (%):</label>
                  <input
                    type="number"
                    value={params.failureRiskRatePercent}
                    onChange={(e) => setParams({ ...params, failureRiskRatePercent: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-slate-900 text-white p-2 rounded-xl border border-slate-800 font-mono text-center focus:border-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Margem de Lucro (%):</label>
                  <input
                    type="number"
                    value={params.desiredProfitMarginPercent}
                    onChange={(e) => setParams({ ...params, desiredProfitMarginPercent: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-slate-900 text-white p-2 rounded-xl border border-slate-800 font-mono font-bold text-emerald-400 text-center focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

          </div>

          <div className="md:col-span-5 flex flex-col justify-between p-5 rounded-3xl bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 border border-slate-800 space-y-4">
            <div>
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block mb-2">
                DETALHAMENTO DE CUSTOS
              </span>

              <div className="space-y-2 text-xs font-mono">
                <div className="flex justify-between text-slate-300">
                  <span>Filamento:</span>
                  <span>R$ {result.filamentCost.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Energia Elétrica:</span>
                  <span>R$ {result.electricityCost.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Depreciação Máquina:</span>
                  <span>R$ {result.depreciationCost.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Risco / Perda ({params.failureRiskRatePercent}%):</span>
                  <span>R$ {result.riskBufferCost.toFixed(2)}</span>
                </div>
                <div className="pt-2 border-t border-slate-800 flex justify-between font-bold text-slate-200">
                  <span>Custo Total Produção:</span>
                  <span className="text-rose-400">R$ {result.totalProductionCost.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-emerald-400">
                  <span>Lucro Bruto estimado:</span>
                  <span>+ R$ {result.profitAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-orange-500/10 border border-orange-500/30 text-center space-y-1">
              <span className="text-[10px] font-mono text-orange-400 tracking-wider block">PREÇO SUGERIDO DE VENDA</span>
              <span className="text-3xl font-black text-white">
                R$ {result.suggestedPrice.toFixed(2)}
              </span>
            </div>

            {products.length > 0 && onApplyPriceToProduct && (
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <label className="block text-[11px] text-slate-400">Aplicar este preço a uma peça do catálogo:</label>
                <div className="flex gap-2">
                  <select
                    value={selectedProductId}
                    onChange={(e) => setSelectedProductId(e.target.value)}
                    className="flex-1 bg-slate-950 text-slate-200 text-xs rounded-xl p-2 border border-slate-800 focus:outline-none"
                  >
                    <option value="">Selecione o produto...</option>
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.title} (Atual: R$ {p.basePrice})
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={handleApplyToProduct}
                    disabled={!selectedProductId}
                    className="px-3 py-2 rounded-xl bg-orange-500 disabled:opacity-40 hover:bg-orange-600 text-white font-bold text-xs transition-all"
                  >
                    Aplicar
                  </button>
                </div>
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
};

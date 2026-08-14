import React, { useState } from 'react';
import type { Product, ProductColor, StoreSettings } from '../types';
import { ThreeDViewer } from './ThreeDViewer';
import { generateWhatsAppLink } from '../utils/whatsapp';
import { X, MessageSquare, CheckCircle2, Box } from 'lucide-react';
import confetti from 'canvas-confetti';

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
  settings: StoreSettings;
}

export const ProductModal: React.FC<ProductModalProps> = ({ product, onClose, settings }) => {
  if (!product) return null;

  const defaultMaterial = product.availableMaterials[0] || settings.customMaterials[0]?.name || 'PLA';
  const [selectedMaterialName, setSelectedMaterialName] = useState<string>(defaultMaterial);

  const [selectedColor, setSelectedColor] = useState<ProductColor>(
    product.availableColors[0] || { name: 'Preto', hex: '#121212' }
  );
  const [scaleMultiplier, setScaleMultiplier] = useState<number>(1);
  const [infillPercent, setInfillPercent] = useState<number>(20);
  const [quantity, setQuantity] = useState<number>(1);
  const [customNotes, setCustomNotes] = useState<string>('');

  // Obter multiplicador do material selecionado de forma dinâmica
  const currentMaterialObj = settings.customMaterials.find(
    (m) => m.name.toLowerCase() === selectedMaterialName.toLowerCase()
  );
  const materialMultiplier = currentMaterialObj ? currentMaterialObj.priceMultiplier : 1.0;

  const scaleFactor = Math.pow(scaleMultiplier, 2.2);
  const infillFactor = 1 + (infillPercent - 20) * 0.005;

  const calculatedPrice = Number(
    (product.basePrice * materialMultiplier * scaleFactor * infillFactor * quantity).toFixed(2)
  );

  const scaledX = Math.round(product.dimensions.x * scaleMultiplier);
  const scaledY = Math.round(product.dimensions.y * scaleMultiplier);
  const scaledZ = Math.round(product.dimensions.z * scaleMultiplier);

  const handleWhatsAppQuote = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });

    const url = generateWhatsAppLink(
      product,
      {
        productId: product.id,
        material: selectedMaterialName,
        color: selectedColor,
        scaleMultiplier,
        infillPercent,
        quantity,
        customNotes,
        calculatedPrice,
      },
      settings
    );

    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col">
        
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/50">
          <div className="flex items-center gap-2">
            <Box className="w-5 h-5 text-orange-400" />
            <h2 className="text-lg font-bold text-white line-clamp-1">{product.title}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          <div className="lg:col-span-6 space-y-4">
            <ThreeDViewer
              stlUrl={product.stlUrl}
              colorHex={selectedColor.hex}
              scale={scaleMultiplier}
            />

            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 text-xs text-slate-400 space-y-2">
              <div className="flex justify-between items-center text-slate-300 font-mono">
                <span>Dimensões Finais Escalonadas:</span>
                <span className="text-orange-400 font-bold">{scaledX} × {scaledY} × {scaledZ} mm</span>
              </div>
              <div className="flex justify-between items-center text-slate-300 font-mono">
                <span>Peso Estimado da Peça:</span>
                <span>~{Math.round(product.weightGrams * scaleFactor)}g</span>
              </div>
              <div className="flex justify-between items-center text-slate-300 font-mono">
                <span>Tempo de Impressão:</span>
                <span>~{Math.round(product.printTimeHours * scaleFactor)} horas</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 space-y-6">
            
            {/* Seletor de Materiais Dinâmicos */}
            <div>
              <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-2">
                1. Escolha o Material do Filamento:
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {product.availableMaterials.map((matName) => {
                  const isSelected = selectedMaterialName.toLowerCase() === matName.toLowerCase();
                  return (
                    <button
                      key={matName}
                      type="button"
                      onClick={() => setSelectedMaterialName(matName)}
                      className={`px-3 py-2 rounded-xl text-xs font-mono font-bold transition-all text-center border ${
                        isSelected
                          ? 'bg-orange-500 text-white border-orange-500 shadow-md shadow-orange-500/20'
                          : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      {matName}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-2">
                2. Cor Selecionada: <span className="text-white font-sans">{selectedColor.name}</span>
              </label>
              <div className="flex flex-wrap items-center gap-3">
                {product.availableColors.map((col, idx) => {
                  const isSelected = selectedColor.name === col.name;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedColor(col)}
                      className={`relative w-8 h-8 rounded-full border-2 transition-all flex items-center justify-center ${
                        isSelected
                          ? 'border-orange-500 scale-110 shadow-lg shadow-orange-500/30'
                          : 'border-slate-700 hover:scale-105'
                      }`}
                      style={{ backgroundColor: col.hex }}
                      title={col.name}
                    >
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-white drop-shadow-md" />}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-mono text-slate-400 uppercase tracking-wider">
                  3. Escala do Tamanho:
                </label>
                <span className="text-xs font-mono font-bold text-cyan-400">
                  {(scaleMultiplier * 100).toFixed(0)}%
                </span>
              </div>
              <input
                type="range"
                min="0.5"
                max="2.5"
                step="0.1"
                value={scaleMultiplier}
                onChange={(e) => setScaleMultiplier(parseFloat(e.target.value))}
                className="w-full h-2 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-orange-500"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
                <span>50% (Mini)</span>
                <span>100% (Padrão)</span>
                <span>250% (Max)</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-2">
                4. Preenchimento Interno (Infill):
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[15, 25, 50, 100].map((inf) => (
                  <button
                    key={inf}
                    type="button"
                    onClick={() => setInfillPercent(inf)}
                    className={`py-1.5 rounded-xl text-xs font-mono transition-all border ${
                      infillPercent === inf
                        ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/50'
                        : 'bg-slate-950 text-slate-400 border-slate-800'
                    }`}
                  >
                    {inf}% {inf === 100 ? '(Sólido)' : ''}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-mono text-slate-400 uppercase mb-1">Quantidade:</label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full bg-slate-950 text-white text-sm rounded-xl p-2.5 border border-slate-800 text-center font-mono font-bold focus:border-orange-500 focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-mono text-slate-400 uppercase mb-1">Obs / Modificações:</label>
                <input
                  type="text"
                  placeholder="Ex: Adicionar furo para parafuso M3..."
                  value={customNotes}
                  onChange={(e) => setCustomNotes(e.target.value)}
                  className="w-full bg-slate-950 text-slate-200 placeholder-slate-600 text-xs rounded-xl p-2.5 border border-slate-800 focus:border-orange-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <span className="text-xs text-slate-400 block font-mono">VALOR TOTAL ESTIMADO</span>
                <span className="text-2xl font-black text-emerald-400">
                  R$ {calculatedPrice.toFixed(2)}
                </span>
              </div>

              <button
                type="button"
                onClick={handleWhatsAppQuote}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold text-sm shadow-xl shadow-emerald-500/20 transform hover:scale-105 transition-all"
              >
                <MessageSquare className="w-5 h-5" />
                <span>Solicitar no WhatsApp</span>
              </button>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

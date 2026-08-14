import type { Product, QuoteCustomization, StoreSettings } from '../types';

export const generateWhatsAppLink = (
  product: Product,
  customization: QuoteCustomization,
  settings: StoreSettings
): string => {
  const scaledX = Math.round(product.dimensions.x * customization.scaleMultiplier);
  const scaledY = Math.round(product.dimensions.y * customization.scaleMultiplier);
  const scaledZ = Math.round(product.dimensions.z * customization.scaleMultiplier);

  const printModeLabel = customization.printMode === 'ams'
    ? 'Com AMS (Multicolor)'
    : 'Sem AMS (Cor Unica / Monocromatico)';

  const lines = [
    `Ola ${settings.storeName}! Gostaria de solicitar um orcamento para a peca 3D:`,
    '',
    `*PRODUTO:* ${product.title}`,
    `*MODO DE IMPRESSAO:* ${printModeLabel}`,
    `*MATERIAL:* ${customization.material}`,
    `*COR SELECIONADA:* ${customization.color.name}`,
    `*ESCALA:* ${(customization.scaleMultiplier * 100).toFixed(0)}% (${scaledX} x ${scaledY} x ${scaledZ} mm)`,
    `*PREENCHIMENTO (INFILL):* ${customization.infillPercent}%`,
    `*QUANTIDADE:* ${customization.quantity} unidade(s)`,
  ];

  if (customization.customNotes) {
    lines.push(`*OBSERVACOES:* ${customization.customNotes}`);
  }

  lines.push(`*VALOR ESTIMADO:* R$ ${customization.calculatedPrice.toFixed(2)}`);
  lines.push('');
  lines.push('Podemos confirmar a producao e o prazo de entrega?');

  const text = lines.join('\n');
  const encodedText = encodeURIComponent(text);
  const cleanPhone = settings.whatsappNumber.replace(/\D/g, '');
  return `https://wa.me/${cleanPhone}?text=${encodedText}`;
};

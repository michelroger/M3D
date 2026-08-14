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
    ? '🌈 Com AMS (Multicolor / Bambu Lab)'
    : '🧱 Sem AMS (Monocromático / Cor Única)';

  const message = `Olá ${settings.storeName}! Gostaria de solicitar um orçamento para a peça 3D:

📦 *PRODUTO:* ${product.title}
🧊 *MODO DE IMPRESSÃO:* ${printModeLabel}
🧵 *MATERIAL:* ${customization.material}
🎨 *COR SELECIONADA:* ${customization.color.name}
📏 *ESCALA:* ${(customization.scaleMultiplier * 100).toFixed(0)}% (${scaledX} × ${scaledY} × ${scaledZ} mm)
🔬 *INFILL:* ${customization.infillPercent}%
🔢 *QUANTIDADE:* ${customization.quantity} unidade(s)
${customization.customNotes ? `📝 *OBSERVAÇÕES:* ${customization.customNotes}\n` : ''}
💰 *VALOR ESTIMADO:* R$ ${customization.calculatedPrice.toFixed(2)}

Podemos confirmar a produção e o prazo de entrega?`;

  const encodedMessage = encodeURIComponent(message);
  const cleanPhone = settings.whatsappNumber.replace(/\D/g, '');
  return `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
};

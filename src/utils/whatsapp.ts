import type { Product, QuoteCustomization, StoreSettings } from '../types';

export function generateWhatsAppLink(
  product: Product,
  customization: QuoteCustomization,
  settings: StoreSettings
): string {
  const cleanPhone = settings.whatsappNumber.replace(/\D/g, '');
  
  const scaledX = Math.round(product.dimensions.x * customization.scaleMultiplier);
  const scaledY = Math.round(product.dimensions.y * customization.scaleMultiplier);
  const scaledZ = Math.round(product.dimensions.z * customization.scaleMultiplier);

  const message = `Olá, *${settings.storeName}*! 👋

Gostaria de solicitar um orçamento personalizado para a peça 3D:

🧊 *Peça*: ${product.title}
🆔 *Código*: ${product.id}
🎨 *Cor Escolhida*: ${customization.color.name}
🧵 *Material*: ${customization.material}
📐 *Dimensões Estimadas*: ${scaledX} x ${scaledY} x ${scaledZ} mm (Escala ${(customization.scaleMultiplier * 100).toFixed(0)}%)
🎯 *Preenchimento (Infill)*: ${customization.infillPercent}%
📦 *Quantidade*: ${customization.quantity} unidade(s)
💰 *Estimativa de Valor*: R$ ${customization.calculatedPrice.toFixed(2)}

${customization.customNotes ? `📝 *Observações / Pedido Especial*:\n"${customization.customNotes}"\n` : ''}
Poderia me confirmar a disponibilidade e prazo de produção?`;

  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
}

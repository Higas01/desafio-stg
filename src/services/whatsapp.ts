import { CartItem } from '@/types';

export const generateWhatsAppMessage = (
  items: CartItem[],
  total: number,
  userName: string
) => {
  const phoneNumber =
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ||
    '5511999999999';

  let message = `🛒 *Novo Pedido - ${userName}*\n\n`;
  message += `📋 *Itens do Pedido:*\n`;

  items.forEach((item, index) => {
    message += `${index + 1}. *${
      item.product?.name
    }*\n`;
    message += `   Quantidade: ${item.quantity}\n`;
    message += `   Preço unidade.: R$ ${item.product?.price.toFixed(
      2
    )}\n`;
    message += `   Subtotal: R$ ${(
      item.product!.price * item.quantity
    ).toFixed(2)}\n\n`;
  });

  message += `💰 *Total: R$ ${total.toFixed(
    2
  )}*\n\n`;
  message += `📅 Data: ${new Date().toLocaleString(
    'pt-BR'
  )}\n\n`;
  message += `✅ Confirma o pedido?`;

  const encodedMessage =
    encodeURIComponent(message);
  return `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
};

export const openWhatsApp = (
  items: CartItem[],
  total: number,
  userName: string
) => {
  const whatsappUrl = generateWhatsAppMessage(
    items,
    total,
    userName
  );
  window.open(whatsappUrl, '_blank');
};

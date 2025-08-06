'use client';

import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import {
  X,
  Plus,
  Minus,
  ShoppingBag,
  Trash2,
} from 'lucide-react';
import { formatCurrency } from '@/utils';
import { openWhatsApp } from '@/services/whatsapp';
import Image from 'next/image';
import { useState } from 'react';
import { useOrder } from '@/hooks/useOrder';

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartModal: React.FC<CartModalProps> = ({
  isOpen,
  onClose,
}) => {
  const {
    cart,
    updateQuantity,
    removeFromCart,
    clearCart,
    loading,
  } = useCart();
  const { user } = useAuth();
  const [isCheckingOut, setIsCheckingOut] =
    useState(false);
  const { createOrder } = useOrder();

  if (!isOpen) return null;

  const handleQuantityChange = async (
    itemId: string,
    newQuantity: number
  ) => {
    if (newQuantity < 1) {
      await removeFromCart(itemId);
    } else {
      await updateQuantity(itemId, newQuantity);
    }
  };

  const handleCheckout = async () => {
    if (!cart || !user || cart.items.length === 0)
      return;

    setIsCheckingOut(true);
    openWhatsApp(
      cart.items,
      cart.total,
      user.name
    );

    createOrder({
      items: cart.items,
      total: cart.total,
      whatsapp_message: '',
    });

    setTimeout(() => {
      onClose();
      setIsCheckingOut(false);
    }, 1000);
  };

  const cartItems = cart?.items || [];
  const cartTotal = cart?.total || 0;
  const itemCount = cartItems.reduce(
    (count, item) => count + item.quantity,
    0
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
      <div className="bg-white dark:bg-gray-800 rounded-t-2xl sm:rounded-lg shadow-xl w-full sm:max-w-2xl max-h-[95vh] sm:max-h-[90vh] flex flex-col animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-800 rounded-t-2xl sm:rounded-t-lg">
          <div className="flex items-center space-x-2">
            <ShoppingBag className="h-5 w-5 text-primary-600" />
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
              <span className="hidden sm:inline">
                Carrinho de Compras
              </span>
              <span className="sm:hidden">
                Carrinho
              </span>
            </h2>
            {itemCount > 0 && (
              <span className="bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200 text-xs sm:text-sm px-2 py-1 rounded-full">
                {itemCount}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="btn btn-ghost btn-sm p-2 touch-manipulation"
            aria-label="Close cart"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 sm:py-16 px-4 sm:px-6">
              <div className="text-gray-400 mb-4">
                <ShoppingBag className="h-12 sm:h-16 w-12 sm:w-16 mx-auto" />
              </div>
              <h3 className="text-base sm:text-lg font-medium text-gray-900 dark:text-white mb-2 text-center">
                Seu carrinho está vazio
              </h3>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 text-center mb-6">
                Adicione alguns produtos ao seu
                carrinho para continuar.
              </p>
              <button
                onClick={onClose}
                className="btn btn-primary btn-md w-full sm:w-auto"
              >
                Continuar Comprando
              </button>
            </div>
          ) : (
            <div className="p-3 sm:p-6 space-y-3 sm:space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 sm:p-4"
                >
                  {/* Mobile Layout */}
                  <div className="flex sm:hidden">
                    {/* Product Image */}
                    <div className="relative w-16 h-16 flex-shrink-0 mr-3">
                      <Image
                        src={
                          item.product
                            ?.image_url || ''
                        }
                        alt={
                          item.product?.name || ''
                        }
                        fill
                        className="object-cover rounded-md"
                        sizes="64px"
                      />
                    </div>

                    {/* Product Info & Controls */}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 dark:text-white text-sm line-clamp-2 mb-1">
                        {item.product?.name}
                      </h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                        {formatCurrency(
                          item.product?.price || 0
                        )}{' '}
                        cada
                      </p>

                      {/* Controls Row */}
                      <div className="flex items-center justify-between">
                        {/* Quantity Controls */}
                        <div className="flex items-center space-x-1 touch-manipulation">
                          <button
                            onClick={() =>
                              handleQuantityChange(
                                item.id,
                                item.quantity - 1
                              )
                            }
                            disabled={loading}
                            className="btn btn-outline btn-sm w-9 h-9 p-0 flex items-center justify-center"
                          >
                            <Minus className="h-3 w-3" />{' '}
                          </button>

                          <span className="w-8 text-center font-medium text-sm">
                            {item.quantity}
                          </span>

                          <button
                            onClick={() =>
                              handleQuantityChange(
                                item.id,
                                item.quantity + 1
                              )
                            }
                            disabled={loading}
                            className="btn btn-outline btn-sm w-9 h-9 p-0 flex items-center justify-center"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>

                        {/* Price & Remove */}
                        <div className="flex items-center space-x-2">
                          <p className="font-medium text-gray-900 dark:text-white text-sm">
                            {formatCurrency(
                              (item.product
                                ?.price || 0) *
                                item.quantity
                            )}
                          </p>
                          <button
                            onClick={() =>
                              removeFromCart(
                                item.id
                              )
                            }
                            disabled={loading}
                            className="btn btn-ghost btn-sm text-red-600 hover:text-red-700 hover:bg-red-50 p-2 touch-manipulation"
                            aria-label="Remover item"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Desktop Layout */}
                  <div className="hidden sm:flex items-center space-x-4">
                    {/* Product Image */}
                    <div className="relative w-20 h-20 flex-shrink-0">
                      <Image
                        src={
                          item.product
                            ?.image_url || ''
                        }
                        alt={
                          item.product?.name || ''
                        }
                        fill
                        className="object-cover rounded-md"
                        sizes="80px"
                      />
                    </div>

                    {/* Product Info - Fixed width for alignment */}
                    <div className="flex-1 min-w-0 max-w-xs">
                      <h4 className="font-medium text-gray-900 dark:text-white line-clamp-2 mb-1">
                        {item.product?.name}
                      </h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {formatCurrency(
                          item.product?.price || 0
                        )}{' '}
                        cada
                      </p>
                    </div>

                    {/* Quantity Controls - Fixed width for alignment */}
                    <div className="flex items-center justify-center space-x-3 min-w-[120px]">
                      <button
                        onClick={() =>
                          handleQuantityChange(
                            item.id,
                            item.quantity - 1
                          )
                        }
                        disabled={loading}
                        className="btn btn-outline btn-sm w-8 h-8 p-0 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                      >
                        <Minus className="h-3 w-3" />
                      </button>

                      <span className="w-8 text-center font-medium text-gray-900 dark:text-white">
                        {item.quantity}
                      </span>

                      <button
                        onClick={() =>
                          handleQuantityChange(
                            item.id,
                            item.quantity + 1
                          )
                        }
                        disabled={loading}
                        className="btn btn-outline btn-sm w-8 h-8 p-0 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>

                    {/* Price - Fixed width for alignment */}
                    <div className="text-right min-w-[100px]">
                      <p className="font-semibold text-lg text-gray-900 dark:text-white">
                        {formatCurrency(
                          (item.product?.price ||
                            0) * item.quantity
                        )}
                      </p>
                    </div>

                    {/* Remove Button - Fixed width */}
                    <div className="min-w-[40px] flex justify-center">
                      <button
                        onClick={() =>
                          removeFromCart(item.id)
                        }
                        disabled={loading}
                        className="btn btn-ghost btn-sm text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 p-2 transition-colors"
                        aria-label="Remove item"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {cartItems.length > 0 && (
          <div className="border-t border-gray-200 dark:border-gray-700 p-4 sm:p-6 space-y-4 bg-white dark:bg-gray-800 sticky bottom-0">
            {/* Total */}
            <div className="flex items-center justify-between text-base sm:text-lg font-semibold">
              <span className="text-gray-900 dark:text-white">
                Total:
              </span>
              <span className="text-primary-600 dark:text-primary-400">
                {formatCurrency(cartTotal)}
              </span>
            </div>

            {/* Actions - Improved desktop layout */}
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
              <button
                onClick={handleCheckout}
                disabled={
                  loading ||
                  isCheckingOut ||
                  !user
                }
                className="btn btn-primary btn-md w-full sm:flex-1 order-1 sm:order-1 touch-manipulation font-semibold"
              >
                {isCheckingOut ? (
                  <>
                    <div className="w-4 h-4 mr-2 bg-white/30 rounded animate-pulse" />
                    Abrindo WhatsApp...
                  </>
                ) : (
                  'Finalizar no WhatsApp'
                )}
              </button>
              <button
                onClick={clearCart}
                disabled={loading}
                className="btn btn-outline btn-md w-full sm:w-auto sm:px-6 order-2 sm:order-2 touch-manipulation text-red-600 border-red-300 hover:bg-red-50 hover:border-red-400 dark:text-red-400 dark:border-red-600 dark:hover:bg-red-900/20"
              >
                Limpar Carrinho
              </button>
            </div>

            {!user && (
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 text-center">
                Você precisa estar logado para
                finalizar a compra.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CartModal;

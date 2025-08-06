'use client';

import React, { useState } from 'react';
import {
  Calendar,
  Package,
  DollarSign,
  MessageCircle,
  ChevronDown,
  ChevronUp,
  Eye,
  RotateCcw,
} from 'lucide-react';
import { Order } from '@/types';
import {
  formatCurrency,
  formatDate,
} from '@/utils';
import Image from 'next/image';

interface OrderCardProps {
  order: Order;
  onViewDetails?: (orderId: string) => void;
  onDuplicate?: (orderId: string) => void;
  loading?: boolean;
}

const OrderCard: React.FC<OrderCardProps> = ({
  order,
  onDuplicate,
  onViewDetails,
  loading = false,
}) => {
  const [isExpanded, setIsExpanded] =
    useState(false);

  const itemCount = order.items.reduce(
    (count, item) => count + item.quantity,
    0
  );

  // Lógica de exibição escalonada
  const previewItems = order.items.slice(0, 4); // Sempre visível
  const expandedItems = order.items.slice(0, 8); // Estado expandido
  const remainingItems = order.items.slice(8); // Scroll adicional
  const hasMoreItems = order.items.length > 4;
  const additionalCount = order.items.length - 4;

  const toggleExpansion = () => {
    setIsExpanded(!isExpanded);
  };

  // Status do pedido com cores dinâmicas
  const getOrderStatus = () => {
    const statuses = [
      {
        label: 'Enviado via WhatsApp',
        color: 'green',
        icon: MessageCircle,
      },
      {
        label: 'Processando',
        color: 'yellow',
        icon: Package,
      },
      {
        label: 'Entregue',
        color: 'blue',
        icon: Package,
      },
    ];
    return statuses[0]; // Para demo, sempre WhatsApp
  };

  const status = getOrderStatus();
  const StatusIcon = status.icon;

  // Componente otimizado para item do pedido
  const OrderItem = React.memo(
    ({
      item,
      index,
    }: {
      item: any;
      index: number;
    }) => (
      <div
        className="flex items-center space-x-3 animate-fade-in hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-md p-2 transition-colors duration-200"
        style={{
          animationDelay: `${index * 50}ms`,
        }}
      >
        {/* Product Image */}
        <div className="relative w-12 h-12 flex-shrink-0 group">
          <Image
            src={
              item.product?.image_url ||
              '/placeholder-product.png'
            }
            alt={item.product?.name || 'Produto'}
            fill
            className="object-cover rounded-md group-hover:scale-105 transition-transform duration-200"
            sizes="48px"
          />
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 rounded-md transition-all duration-200" />
        </div>

        {/* Product Info */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 dark:text-white truncate group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-200">
            {item.product?.name}
          </p>
          <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
            <span className="font-medium">
              Qtd: {item.quantity}
            </span>
            <span>•</span>
            <span>
              {formatCurrency(
                item.product?.price || 0
              )}
            </span>
            {item.product?.category && (
              <>
                <span>•</span>
                <span className="text-primary-600 dark:text-primary-400">
                  {item.product.category}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Item Total */}
        <div className="text-right">
          <div className="text-sm font-semibold text-gray-900 dark:text-white">
            {formatCurrency(
              (item.product?.price || 0) *
                item.quantity
            )}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {item.quantity > 1 &&
              `${item.quantity}x unidade`}
          </div>
        </div>
      </div>
    )
  );

  return (
    <div className="bg-white dark:bg-gray-800 transition-all duration-300 animate-fade-in rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-lg hover:border-primary-200 dark:hover:border-primary-700 relative overflow-hidden">
      {/* Header Enhanced */}
      <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-transparent to-gray-50/50 dark:to-gray-700/20">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            {/* Order ID & Date */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-2 sm:space-y-0">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Pedido #{order.id}
              </h3>
              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                <Calendar className="h-4 w-4 mr-1 flex-shrink-0" />
                <span>
                  {formatDate(order.created_at)}
                </span>
              </div>
            </div>

            {/* Enhanced Status */}
            <div className="mt-3 flex items-center space-x-3">
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-${status.color}-100 dark:bg-${status.color}-900/20 text-${status.color}-600 dark:text-${status.color}-400`}
              >
                <StatusIcon className="h-3 w-3 mr-1" />
                {status.label}
              </span>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {itemCount}{' '}
                {itemCount === 1
                  ? 'produto'
                  : 'produtos'}
              </div>
            </div>
          </div>

          {/* Enhanced Actions */}
          <div className="relative ml-4">
            <div className="flex items-center space-x-3">
              {/* Total Value Card */}
              <div className="text-right bg-primary-50 dark:bg-primary-900/20 p-3 rounded-lg">
                <div className="flex items-center text-xl font-bold text-primary-700 dark:text-primary-300">
                  <DollarSign className="h-5 w-5 mr-1" />
                  {formatCurrency(order.total)}
                </div>
                <div className="text-xs text-primary-600 dark:text-primary-400">
                  Total do pedido
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col space-y-2">
                {onViewDetails && (
                  <button
                    onClick={() =>
                      onViewDetails(order.id)
                    }
                    className="btn btn-ghost btn-sm text-gray-600 hover:text-primary-600"
                    title="Ver detalhes"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                )}

                {onDuplicate && (
                  <button
                    onClick={() =>
                      onDuplicate(order.id)
                    }
                    disabled={loading}
                    className="btn btn-outline btn-sm disabled:opacity-50 hover:scale-105 transition-transform duration-200"
                    title="Repetir pedido"
                  >
                    {loading ? (
                      <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <RotateCcw className="h-4 w-4" />
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Items Preview Enhanced */}
      <div className="p-4 sm:p-6">
        {/* Container com animação suave */}
        <div
          className={`transition-all duration-500 ease-in-out ${
            isExpanded
              ? 'max-h-[32rem]'
              : 'max-h-none'
          }`}
        >
          {/* Área de scroll otimizada */}
          <div
            className={`${
              isExpanded
                ? 'max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-primary-300 dark:scrollbar-thumb-primary-600 scrollbar-track-gray-100 dark:scrollbar-track-gray-800 pr-2'
                : ''
            }`}
          >
            <div className="space-y-1">
              {/* Exibição condicional otimizada */}
              {!isExpanded
                ? previewItems.map(
                    (item, index) => (
                      <OrderItem
                        key={item.id}
                        item={item}
                        index={index}
                      />
                    )
                  )
                : expandedItems.map(
                    (item, index) => (
                      <OrderItem
                        key={item.id}
                        item={item}
                        index={index}
                      />
                    )
                  )}

              {/* Itens restantes com scroll suave */}
              {isExpanded &&
                remainingItems.length > 0 && (
                  <div className="border-t border-gray-100 dark:border-gray-700 mt-3 pt-3">
                    <div className="text-xs text-gray-500 dark:text-gray-400 mb-2 px-2">
                      Itens adicionais (
                      {remainingItems.length})
                    </div>
                    <div className="space-y-1">
                      {remainingItems.map(
                        (item, index) => (
                          <OrderItem
                            key={item.id}
                            item={item}
                            index={index + 8}
                          />
                        )
                      )}
                    </div>
                  </div>
                )}
            </div>
          </div>
        </div>

        {/* Enhanced Toggle Button */}
        {hasMoreItems && (
          <div className="text-center py-4 mt-4 border-t border-gray-100 dark:border-gray-700">
            <button
              onClick={toggleExpansion}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
            >
              {isExpanded ? (
                <>
                  <ChevronUp className="h-4 w-4 mr-2 transition-transform duration-200" />
                  <span>Mostrar menos itens</span>
                </>
              ) : (
                <>
                  <span>
                    Ver todos os{' '}
                    {order.items.length} itens
                  </span>
                  <span className="ml-2 px-2 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full text-xs font-semibold">
                    +{additionalCount}
                  </span>
                  <ChevronDown className="h-4 w-4 ml-2 transition-transform duration-200" />
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Loading Overlay */}
      {loading && (
        <div className="absolute inset-0 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm flex items-center justify-center">
          <div className="flex items-center space-x-2">
            <div className="w-5 h-5 border-2 border-primary-600 border-t-transparent rounded-full animate-spin" />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Processando...
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderCard;

import { formatCurrency } from '@/utils';
import Image from 'next/image';
import React from 'react';

const OrderItem = ({
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
);

export default React.memo(OrderItem);

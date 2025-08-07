'use client';

import React from 'react';
import {
  Package,
  TrendingUp,
} from 'lucide-react';
import { formatCurrency } from '@/utils';
import { OrderStats } from '@/types';

interface StatsCardsProps {
  stats?: OrderStats | null;
  loading?: boolean;
}

const StatsCardsSkeleton: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      {Array.from({ length: 2 }).map((_, i) => (
        <div
          key={i}
          className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center">
            <div className="h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            <div className="ml-4 space-y-2">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 animate-pulse"></div>
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-16 animate-pulse"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

const StatsCards: React.FC<StatsCardsProps> = ({
  stats,
  loading = false,
}) => {
  if (loading || !stats) {
    return <StatsCardsSkeleton />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="flex items-center">
          <Package className="h-10 w-10 text-blue-600 dark:text-blue-400" />
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Total de Pedidos
            </p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              {stats.total_orders}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="flex items-center">
          <TrendingUp className="h-10 w-10 text-green-600 dark:text-green-400" />
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Total Gasto
            </p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              {formatCurrency(stats.total_spent)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsCards;

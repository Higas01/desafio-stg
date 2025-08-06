'use client';

import React, { useState, useMemo } from 'react';
import {
  Search,
  Package,
  TrendingUp,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { OrderService } from '@/http/services/order.service';
import OrderCard from '@/components/OrderCard';
import { OrderCardSkeleton } from '@/components/Skeleton';
import { formatCurrency } from '@/utils';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';

interface OrderFilters {
  search: string;
  dateRange: 'all' | 'week' | 'month' | 'quarter';
}

const PedidosPage: React.FC = () => {
  const { user } = useAuth();
  const [filters, setFilters] =
    useState<OrderFilters>({
      search: '',
      dateRange: 'all',
    });

  const {
    data: orders = [],
    isLoading: loadingOrders,
  } = useQuery({
    queryKey: ['orders', user?.id, filters],
    queryFn: async () => {
      if (!user) return [];

      const dateFilters: any = {};

      if (filters.dateRange !== 'all') {
        const now = new Date();
        const startDate = new Date();

        switch (filters.dateRange) {
          case 'week':
            startDate.setDate(now.getDate() - 7);
            break;
          case 'month':
            startDate.setMonth(
              now.getMonth() - 1
            );
            break;
          case 'quarter':
            startDate.setMonth(
              now.getMonth() - 3
            );
            break;
        }

        dateFilters.startDate =
          startDate.toISOString();
      }

      return OrderService.getUserOrders(user.id, {
        ...dateFilters,
        limit: 50,
      });
    },
    enabled: !!user,
  });

  const { data: stats } = useQuery({
    queryKey: ['order-stats', user?.id],
    queryFn: () =>
      OrderService.getUserOrderStats(user!.id),
    enabled: !!user,
  });

  const filteredOrders = useMemo(() => {
    if (!filters.search) return orders;

    return orders.filter(
      (order) =>
        order.id
          .toLowerCase()
          .includes(
            filters.search.toLowerCase()
          ) ||
        order.items.some((item) =>
          item.product?.name
            .toLowerCase()
            .includes(
              filters.search.toLowerCase()
            )
        )
    );
  }, [orders, filters.search]);

  const handleFilterChange = (
    key: keyof OrderFilters,
    value: string
  ) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Faça login para ver seus pedidos
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Você precisa estar logado para acessar
            o histórico de pedidos.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Meus Pedidos
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Acompanhe seus pedidos e histórico
              de compras
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        {stats && (
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
                    {formatCurrency(
                      stats.total_spent
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 mb-6">
        <div className="p-4">
          <div className="flex flex-col lg:flex-row lg:items-center space-y-4 lg:space-y-0 lg:space-x-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar por ID do pedido ou produto..."
                  value={filters.search}
                  onChange={(e) =>
                    handleFilterChange(
                      'search',
                      e.target.value
                    )
                  }
                  className="input pl-10 w-full"
                />
              </div>
            </div>

            {/* Date Range Filter */}
            <select
              value={filters.dateRange}
              onChange={(e) =>
                handleFilterChange(
                  'dateRange',
                  e.target.value
                )
              }
              className="input w-auto"
            >
              <option value="all">
                Todos os p]eríodos
              </option>
              <option value="week">
                Última semana
              </option>
              <option value="month">
                Último mês
              </option>
              <option value="quarter">
                Últimos 3 meses
              </option>
            </select>
          </div>
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {loadingOrders ? (
          // Loading skeletons
          Array.from({ length: 3 }).map(
            (_, i) => (
              <OrderCardSkeleton key={i} />
            )
          )
        ) : filteredOrders.length > 0 ? (
          // Orders list
          filteredOrders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
            />
          ))
        ) : (
          // Empty state
          <div className="text-center py-12">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              {filters.search ||
              filters.dateRange !== 'all'
                ? 'Nenhum pedido encontrado'
                : 'Você ainda não fez nenhum pedido'}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {filters.search ||
              filters.dateRange !== 'all'
                ? 'Tente ajustar os filtros de busca'
                : 'Que tal começar explorando nossos produtos?'}
            </p>
            {!filters.search &&
              filters.dateRange === 'all' && (
                <Link href="/">
                  <button className="btn btn-primary">
                    Explorar Produtos
                  </button>
                </Link>
              )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PedidosPage;

'use client';

import React, { useState, useMemo } from 'react';
import { Search, Package } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { OrderService } from '@/http/services/order.service';
import OrderCard from '@/components/OrderCard';
import { OrderCardSkeleton } from '@/components/Skeleton';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import StatsCards from '@/components/Orders/StatsCards';
import Filters from '@/components/Orders/Filters';
import { Order, OrderStats } from '@/types';

interface OrderFilters {
  search: string;
  dateRange: 'all' | 'week' | 'month' | 'quarter';
}

interface OrdersWithStats {
  orders: Order[];
  stats: OrderStats | null;
}

const PedidosPage: React.FC = () => {
  const { user } = useAuth();
  const [filters, setFilters] =
    useState<OrderFilters>({
      search: '',
      dateRange: 'all',
    });

  const {
    data,
    isLoading: loadingData,
    isFetching,
    isSuccess: dataLoaded,
  } = useQuery<OrdersWithStats>({
    queryKey: [
      'orders-with-stats',
      user?.id,
      filters,
    ],
    queryFn:
      async (): Promise<OrdersWithStats> => {
        if (!user) {
          return { orders: [], stats: null };
        }

        const dateFilters: any = {};

        if (filters.dateRange !== 'all') {
          const now = new Date();
          const startDate = new Date();

          switch (filters.dateRange) {
            case 'week':
              startDate.setDate(
                now.getDate() - 7
              );
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

        try {
          const [orders, stats] =
            await Promise.all([
              OrderService.getUserOrders(
                user.id,
                {
                  ...dateFilters,
                }
              ),
              OrderService.getUserOrderStats(
                user.id
              ),
            ]);

          return { orders, stats };
        } catch (error) {
          return { orders: [], stats: null };
        }
      },
  });

  const orders = useMemo(
    () => data?.orders ?? [],
    [data]
  );
  const stats = useMemo(
    () => data?.stats ?? null,
    [data]
  );

  const filteredOrders = useMemo(() => {
    if (!filters.search) return orders;

    return orders?.filter(
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

  const handleClearFilters = () => {
    setFilters({
      search: '',
      dateRange: 'all',
    });
  };

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

        <StatsCards
          stats={stats}
          loading={loadingData}
        />
      </div>

      <Filters
        filters={filters}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
      />

      {/* Orders List */}
      <div className="space-y-4">
        {loadingData && !dataLoaded ? (
          Array.from({ length: 3 }).map(
            (_, i) => (
              <OrderCardSkeleton key={i} />
            )
          )
        ) : dataLoaded &&
          orders.length === 0 &&
          !filters.search &&
          filters.dateRange === 'all' ? (
          <div className="text-center py-12">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Você ainda não fez nenhum pedido
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Que tal começar explorando nossos
              produtos?
            </p>
            <Link href="/">
              <button className="btn btn-primary p-2">
                Explorar Produtos
              </button>
            </Link>
          </div>
        ) : dataLoaded &&
          orders.length > 0 &&
          filteredOrders.length === 0 ? (
          <div className="text-center py-12">
            <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Nenhum pedido encontrado
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Tente ajustar os filtros de busca
            </p>
            <button
              onClick={handleClearFilters}
              className="btn btn-outline"
            >
              Limpar Filtros
            </button>
          </div>
        ) : (
          <>
            {isFetching && !loadingData && (
              <div className="text-center py-4">
                <div className="inline-flex items-center">
                  <div className="w-4 h-4 border-2 border-primary-600 border-t-transparent rounded-full animate-spin mr-2"></div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Atualizando...
                  </span>
                </div>
              </div>
            )}

            {filteredOrders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
              />
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default PedidosPage;

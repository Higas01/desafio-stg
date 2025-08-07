import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import {
  OrderService,
  CreateOrderData,
} from '@/http/services/order.service';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { Order, OrderStats } from '@/types';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

interface UseOrderReturn {
  orders: Order[];
  stats: OrderStats | undefined;
  isLoadingOrders: boolean;
  isLoadingStats: boolean;

  createOrder: (
    orderData: Omit<CreateOrderData, 'user_id'>
  ) => void;

  isCreatingOrder: boolean;

  refetchOrders: () => void;
  refetchStats: () => void;
}

export const useOrder = (): UseOrderReturn => {
  const { user } = useAuth();
  const { clearCart } = useCart();
  const queryClient = useQueryClient();
  const router = useRouter();

  const ORDERS_KEY = ['orders', user?.id];
  const STATS_KEY = ['order-stats', user?.id];

  const {
    data: orders = [],
    isLoading: isLoadingOrders,
    refetch: refetchOrders,
  } = useQuery({
    queryKey: ORDERS_KEY,
    queryFn: () =>
      OrderService.getUserOrders(user!.id),
    enabled: !!user,
    staleTime: 1000 * 60 * 5,
  });

  const {
    data: stats,
    isLoading: isLoadingStats,
    refetch: refetchStats,
  } = useQuery({
    queryKey: STATS_KEY,
    queryFn: () =>
      OrderService.getUserOrderStats(user!.id),
    enabled: !!user,
    staleTime: 1000 * 60 * 10,
  });

  const createOrderMutation = useMutation({
    mutationFn: async (
      orderData: Omit<CreateOrderData, 'user_id'>
    ) => {
      if (!user) {
        throw new Error(
          'Usuário não autenticado'
        );
      }

      return OrderService.createOrder({
        ...orderData,
        user_id: user.id,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ORDERS_KEY,
      });
      queryClient.invalidateQueries({
        queryKey: STATS_KEY,
      });

      clearCart();
    },
    onError: (error: Error) => {
      toast.error(
        error.message || 'Erro ao criar pedido'
      );
    },
  });

  return {
    orders,
    stats,
    isLoadingOrders,
    isLoadingStats,

    createOrder: createOrderMutation.mutate,

    isCreatingOrder:
      createOrderMutation.isPending,

    refetchOrders,
    refetchStats,
  };
};

export const useOrderHistory = (filters?: {
  search?: string;
  dateRange?:
    | 'all'
    | 'week'
    | 'month'
    | 'quarter';
}) => {
  const { user } = useAuth();

  const getDateFilters = () => {
    if (
      !filters?.dateRange ||
      filters.dateRange === 'all'
    ) {
      return {};
    }

    const now = new Date();
    const startDate = new Date();

    switch (filters.dateRange) {
      case 'week':
        startDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(now.getMonth() - 1);
        break;
      case 'quarter':
        startDate.setMonth(now.getMonth() - 3);
        break;
    }

    return { startDate: startDate.toISOString() };
  };

  const {
    data: orders = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: [
      'order-history',
      user?.id,
      filters,
    ],
    queryFn: () =>
      OrderService.getUserOrders(user!.id, {
        ...getDateFilters(),
        limit: 50,
      }),
    enabled: !!user,
  });

  const filteredOrders = orders.filter(
    (order) => {
      if (!filters?.search) return true;

      const searchLower =
        filters.search.toLowerCase();
      return (
        order.id
          .toLowerCase()
          .includes(searchLower) ||
        order.items.some((item) =>
          item.product?.name
            .toLowerCase()
            .includes(searchLower)
        )
      );
    }
  );

  return {
    orders: filteredOrders,
    isLoading,
    refetch,
    totalCount: orders.length,
    filteredCount: filteredOrders.length,
  };
};

export const useHasOrders = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['has-orders', user?.id],
    queryFn: () =>
      OrderService.hasOrders(user!.id),
    enabled: !!user,
    staleTime: 1000 * 60 * 15,
  });
};

export const useLastOrder = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['last-order', user?.id],
    queryFn: () =>
      OrderService.getLastOrder(user!.id),
    enabled: !!user,
    staleTime: 1000 * 60 * 5,
  });
};

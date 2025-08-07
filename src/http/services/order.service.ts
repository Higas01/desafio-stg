import { supabase } from '@/utils/supabase/supabase';
import { CartItem, Order } from '@/types';

export interface CreateOrderData {
  user_id: string;
  items: CartItem[];
  total: number;
  whatsapp_message: string;
}

export interface OrderFilters {
  startDate?: string;
  endDate?: string;
  limit?: number;
  offset?: number;
}

export class OrderService {
  static async createOrder(
    orderData: CreateOrderData
  ): Promise<Order> {
    const { error, data } = await supabase
      .from('orders')
      .insert({
        user_id: orderData.user_id,
        items: orderData.items,
        total: orderData.total,
        whatsapp_message:
          orderData.whatsapp_message,
      })
      .select()
      .single();

    if (error) {
      throw new Error(
        `Erro ao criar pedido: ${error.message}`
      );
    }

    return {
      id: data.id,
      user_id: data.user_id,
      items: data.items,
      total: data.total,
      whatsapp_message: data.whatsapp_message,
      created_at: data.created_at,
      updated_at: data.updated_at,
    };
  }

  static async getUserOrders(
    userId: string,
    filters?: OrderFilters
  ): Promise<Order[]> {
    let query = supabase
      .from('orders')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (filters?.startDate) {
      query = query.gte(
        'created_at',
        filters.startDate
      );
    }

    if (filters?.endDate) {
      query = query.lte(
        'created_at',
        filters.endDate
      );
    }

    if (filters?.limit) {
      query = query.limit(filters.limit);
    }

    if (filters?.offset) {
      query = query.range(
        filters.offset,
        filters.offset + (filters.limit || 10) - 1
      );
    }

    const { data, error } = await query;

    if (error) {
      throw new Error(
        `Erro ao buscar pedidos: ${error.message}`
      );
    }

    return data.map((order) => ({
      id: order.id,
      user_id: order.user_id,
      items: order.items,
      total: order.total,
      whatsapp_message: order.whatsapp_message,
      created_at: order.created_at,
      updated_at: order.updated_at,
    }));
  }

  static async getOrderById(
    orderId: string
  ): Promise<Order | null> {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      throw new Error(
        `Erro ao buscar pedido: ${error.message}`
      );
    }

    return {
      id: data.id,
      user_id: data.user_id,
      items: data.items,
      total: data.total,
      whatsapp_message: data.whatsapp_message,
      created_at: data.created_at,
      updated_at: data.updated_at,
    };
  }

  static async getUserOrderStats(
    userId: string
  ): Promise<{
    total_orders: number;
    total_spent: number;
  }> {
    const { data, error } = await supabase
      .from('orders')
      .select('total')
      .eq('user_id', userId);

    if (error) {
      throw new Error(
        `Erro ao buscar estatísticas: ${error.message}`
      );
    }

    const stats = data.reduce(
      (acc, order) => {
        acc.total_orders++;
        acc.total_spent += order.total;
        return acc;
      },
      {
        total_orders: 0,
        total_spent: 0,
      }
    );

    return stats;
  }

  static async hasOrders(
    userId: string
  ): Promise<boolean> {
    const { data, error } = await supabase
      .from('orders')
      .select('id')
      .eq('user_id', userId)
      .limit(1);

    if (error) {
      throw new Error(
        `Erro ao verificar pedidos: ${error.message}`
      );
    }

    return data.length > 0;
  }

  static async getLastOrder(
    userId: string
  ): Promise<Order | null> {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      throw new Error(
        `Erro ao buscar último pedido: ${error.message}`
      );
    }

    return {
      id: data.id,
      user_id: data.user_id,
      items: data.items,
      total: data.total,
      whatsapp_message: data.whatsapp_message,
      created_at: data.created_at,
      updated_at: data.updated_at,
    };
  }

  static async duplicateOrder(
    orderId: string,
    userId: string
  ): Promise<Order> {
    const existingOrder = await this.getOrderById(
      orderId
    );

    if (!existingOrder) {
      throw new Error('Pedido não encontrado');
    }

    if (existingOrder.user_id !== userId) {
      throw new Error(
        'Você não tem permissão para duplicar este pedido'
      );
    }

    return this.createOrder({
      user_id: userId,
      items: existingOrder.items,
      total: existingOrder.total,
      whatsapp_message:
        existingOrder.whatsapp_message,
    });
  }

  static async getRecentOrders(
    userId: string,
    limit = 10
  ): Promise<Order[]> {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(
      thirtyDaysAgo.getDate() - 30
    );

    return this.getUserOrders(userId, {
      startDate: thirtyDaysAgo.toISOString(),
      limit,
    });
  }
}

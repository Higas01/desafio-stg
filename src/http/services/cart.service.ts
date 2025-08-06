import { supabase } from '@/services/supabase';
import { CartItem } from '@/types';

export interface LocalCartItem {
  product_id: string;
  quantity: number;
  created_at: string;
  updated_at: string;
}

export class CartService {
  // Métodos para usuários autenticados (Supabase)
  static async getCartItems(
    userId: string
  ): Promise<CartItem[]> {
    const { data, error } = await supabase
      .from('cart_items')
      .select(
        `
        *,
        products (*)
      `
      )
      .eq('user_id', userId);

    if (error) {
      throw new Error(
        `Erro ao buscar itens do carrinho: ${error.message}`
      );
    }

    return data.map((item: any) => ({
      id: item.id,
      user_id: item.user_id,
      product_id: item.product_id,
      product: item.products
        ? {
            id: item.products.id,
            name: item.products.name,
            description:
              item.products.description,
            price: item.products.price,
            image_url: item.products.image_url,
            category: item.products.category,
            created_at: item.products.created_at,
            updated_at: item.products.updated_at,
          }
        : undefined,
      quantity: item.quantity,
      created_at: item.created_at,
      updated_at: item.updated_at,
    }));
  }

  static async addItem(
    userId: string,
    productId: string,
    quantity: number
  ): Promise<void> {
    const {
      data: existingItem,
      error: checkError,
    } = await supabase
      .from('cart_items')
      .select('*')
      .eq('user_id', userId)
      .eq('product_id', productId)
      .maybeSingle();

    if (checkError) {
      throw new Error(
        `Erro ao verificar item existente: ${checkError.message}`
      );
    }

    if (existingItem) {
      // Atualizar quantidade do item existente
      const { error: updateError } =
        await supabase
          .from('cart_items')
          .update({
            quantity:
              existingItem.quantity + quantity,
            updated_at: new Date().toISOString(),
          })
          .eq('id', existingItem.id);

      if (updateError) {
        throw new Error(
          `Erro ao atualizar item no carrinho: ${updateError.message}`
        );
      }
    } else {
      // Adicionar novo item
      const { error: insertError } =
        await supabase.from('cart_items').insert({
          user_id: userId,
          product_id: productId,
          quantity,
        });

      if (insertError) {
        throw new Error(
          `Erro ao adicionar item ao carrinho: ${insertError.message}`
        );
      }
    }
  }

  static async updateQuantity(
    itemId: string,
    quantity: number
  ): Promise<void> {
    const { error } = await supabase
      .from('cart_items')
      .update({
        quantity,
        updated_at: new Date().toISOString(),
      })
      .eq('id', itemId);

    if (error) {
      throw new Error(
        `Erro ao atualizar quantidade: ${error.message}`
      );
    }
  }

  static async removeItem(
    itemId: string
  ): Promise<void> {
    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('id', itemId);

    if (error) {
      throw new Error(
        `Erro ao remover item do carrinho: ${error.message}`
      );
    }
  }

  static async clearCart(
    userId: string
  ): Promise<void> {
    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('user_id', userId);

    if (error) {
      throw new Error(
        `Erro ao limpar carrinho: ${error.message}`
      );
    }
  }

  static getLocalCart(): LocalCartItem[] {
    if (typeof window === 'undefined') return [];

    const localCartData =
      localStorage.getItem('guest_cart');
    if (!localCartData) return [];

    try {
      return JSON.parse(localCartData);
    } catch {
      return [];
    }
  }

  static setLocalCart(
    items: LocalCartItem[]
  ): void {
    if (typeof window === 'undefined') return;

    localStorage.setItem(
      'guest_cart',
      JSON.stringify(items)
    );
  }

  static addToLocalCart(
    productId: string,
    quantity: number
  ): void {
    const localCart = this.getLocalCart();
    const existingIndex = localCart.findIndex(
      (item) => item.product_id === productId
    );

    if (existingIndex >= 0) {
      localCart[existingIndex].quantity +=
        quantity;
      localCart[existingIndex].updated_at =
        new Date().toISOString();
    } else {
      localCart.push({
        product_id: productId,
        quantity,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
    }

    this.setLocalCart(localCart);
  }

  static updateLocalCartQuantity(
    productId: string,
    quantity: number
  ): void {
    const localCart = this.getLocalCart();
    const itemIndex = localCart.findIndex(
      (item) => item.product_id === productId
    );

    if (itemIndex >= 0) {
      if (quantity <= 0) {
        localCart.splice(itemIndex, 1);
      } else {
        localCart[itemIndex].quantity = quantity;
        localCart[itemIndex].updated_at =
          new Date().toISOString();
      }
      this.setLocalCart(localCart);
    }
  }

  static removeFromLocalCart(
    productId: string
  ): void {
    const localCart = this.getLocalCart();
    const updatedCart = localCart.filter(
      (item) => item.product_id !== productId
    );
    this.setLocalCart(updatedCart);
  }

  static clearLocalCart(): void {
    if (typeof window === 'undefined') return;

    localStorage.removeItem('guest_cart');
  }
}

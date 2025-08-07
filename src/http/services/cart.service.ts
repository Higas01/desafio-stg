import { supabase } from '@/utils/supabase/supabase';
import { CartItem } from '@/types';
import { AppError } from '@/handler/AppError';

export interface LocalCartItem {
  product_id: string;
  quantity: number;
  created_at: string;
  updated_at: string;
}

export class CartService {
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
      throw new AppError(
        `Erro ao buscar itens do carrinho: ${error.message}`,
        500
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
    if (!userId || !productId || quantity <= 0) {
      throw new AppError(
        'Dados inválidos para adicionar item ao carrinho',
        400
      );
    }

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
      throw new AppError(
        `Erro ao verificar item existente: ${checkError.message}`,
        500
      );
    }

    if (existingItem) {
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
        throw new AppError(
          `Erro ao atualizar item no carrinho: ${updateError.message}`,
          500
        );
      }
    } else {
      const { error: insertError } =
        await supabase.from('cart_items').insert({
          user_id: userId,
          product_id: productId,
          quantity,
        });

      if (insertError) {
        if (
          insertError.message.includes(
            'foreign key constraint'
          )
        ) {
          throw new AppError(
            'Produto não encontrado',
            404
          );
        }

        if (
          insertError.message.includes(
            'duplicate key'
          )
        ) {
          throw new AppError(
            'Item já existe no carrinho',
            409
          );
        }

        throw new AppError(
          `Erro ao adicionar item ao carrinho: ${insertError.message}`,
          500
        );
      }
    }
  }

  static async updateQuantity(
    itemId: string,
    quantity: number
  ): Promise<void> {
    if (!itemId || quantity < 0) {
      throw new AppError(
        'Dados inválidos para atualizar quantidade',
        400
      );
    }

    if (quantity === 0) {
      await this.removeItem(itemId);
      return;
    }

    const { error } = await supabase
      .from('cart_items')
      .update({
        quantity,
        updated_at: new Date().toISOString(),
      })
      .eq('id', itemId);

    if (error) {
      if (error.message.includes('not found')) {
        throw new AppError(
          'Item não encontrado no carrinho',
          404
        );
      }

      throw new AppError(
        `Erro ao atualizar quantidade: ${error.message}`,
        500
      );
    }
  }

  static async removeItem(
    itemId: string
  ): Promise<void> {
    if (!itemId) {
      throw new AppError(
        'ID do item é obrigatório',
        400
      );
    }

    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('id', itemId);

    if (error) {
      throw new AppError(
        `Erro ao remover item do carrinho: ${error.message}`,
        500
      );
    }
  }

  static async clearCart(
    userId: string
  ): Promise<void> {
    if (!userId) {
      throw new AppError(
        'ID do usuário é obrigatório',
        400
      );
    }

    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('user_id', userId);

    if (error) {
      throw new AppError(
        `Erro ao limpar carrinho: ${error.message}`,
        500
      );
    }
  }

  static async syncLocalCartToUser(
    userId: string
  ): Promise<void> {
    const localCart = this.getLocalCart();

    if (localCart.length === 0) return;

    for (const localItem of localCart) {
      await this.addItem(
        userId,
        localItem.product_id,
        localItem.quantity
      );

      this.clearLocalCart();
    }
  }

  static getLocalCart(): LocalCartItem[] {
    if (typeof window === 'undefined') return [];

    try {
      const localCartData =
        localStorage.getItem('guest_cart');
      if (!localCartData) return [];

      return JSON.parse(localCartData);
    } catch (error) {
      this.clearLocalCart();
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
    if (!productId || quantity <= 0) {
      throw new AppError(
        'Dados inválidos para adicionar ao carrinho',
        400
      );
    }

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
    if (!productId || quantity < 0) {
      throw new AppError(
        'Dados inválidos para atualizar quantidade',
        400
      );
    }

    const localCart = this.getLocalCart();
    const itemIndex = localCart.findIndex(
      (item) => item.product_id === productId
    );

    if (itemIndex >= 0) {
      if (quantity === 0) {
        localCart.splice(itemIndex, 1);
      } else {
        localCart[itemIndex].quantity = quantity;
        localCart[itemIndex].updated_at =
          new Date().toISOString();
      }
      this.setLocalCart(localCart);
    } else {
      throw new AppError(
        'Item não encontrado no carrinho local',
        404
      );
    }
  }

  static removeFromLocalCart(
    productId: string
  ): void {
    if (!productId) {
      throw new AppError(
        'ID do produto é obrigatório',
        400
      );
    }

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

  static getCartItemCount(
    userId?: string
  ): number {
    if (userId) {
      return 0;
    } else {
      const localCart = this.getLocalCart();
      return localCart.reduce(
        (total, item) => total + item.quantity,
        0
      );
    }
  }

  static calculateLocalCartTotal(
    products: any[]
  ): number {
    const localCart = this.getLocalCart();

    return localCart.reduce((total, cartItem) => {
      const product = products.find(
        (p) => p.id === cartItem.product_id
      );
      if (product) {
        return (
          total +
          product.price * cartItem.quantity
        );
      }
      return total;
    }, 0);
  }
}

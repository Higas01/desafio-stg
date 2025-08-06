'use client';

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from 'react';
import {
  Cart,
  CartItem,
  CartContextType,
} from '@/types';
import { useAuth } from './AuthContext';
import { ProductService } from '@/http/services/product.service';
import { CartService } from '@/http/services/cart.service';
import toast from 'react-hot-toast';
import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';

const CartContext = createContext<
  CartContextType | undefined
>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error(
      'useCart must be used within a CartProvider'
    );
  }
  return context;
};

interface CartProviderProps {
  children: React.ReactNode;
}

export const CartProvider: React.FC<
  CartProviderProps
> = ({ children }) => {
  const [cart, setCart] = useState<Cart | null>(
    null
  );
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Query Keys
  const CART_QUERY_KEY = [
    'cart',
    user?.id || 'guest',
  ];

  // Query para carregar carrinho de usuário autenticado
  const {
    data: userCartItems,
    isLoading: isLoadingUserCart,
  } = useQuery({
    queryKey: CART_QUERY_KEY,
    queryFn: () =>
      CartService.getCartItems(user!.id),
    enabled: !!user,
    staleTime: 1000 * 60 * 5, // Cache por 5 minutos
  });

  // Função para carregar carrinho local (guest)
  const loadLocalCart = useCallback(async () => {
    const localCartItems =
      CartService.getLocalCart();
    if (localCartItems.length === 0) {
      setCart(null);
      return;
    }

    const items: CartItem[] = [];

    for (const localItem of localCartItems) {
      try {
        const product =
          await ProductService.getById(
            localItem.product_id
          );
        if (product) {
          items.push({
            id: localItem.product_id,
            user_id: 'guest',
            product_id: localItem.product_id,
            product,
            quantity: localItem.quantity,
            created_at: localItem.created_at,
            updated_at: localItem.updated_at,
          });
        }
      } catch (error) {
        console.error(
          'Error loading local cart product:',
          error
        );
        // Remove item inválido do carrinho local
        CartService.removeFromLocalCart(
          localItem.product_id
        );
      }
    }

    const total = items.reduce(
      (sum, item) =>
        sum +
        (item.product?.price || 0) *
          item.quantity,
      0
    );

    setCart({
      id: 'guest-cart',
      userId: 'guest',
      items,
      total,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  }, []);

  // Atualizar cart quando userCartItems mudar
  useEffect(() => {
    if (user && userCartItems) {
      const total = userCartItems.reduce(
        (sum, item) =>
          sum +
          (item.product?.price || 0) *
            item.quantity,
        0
      );

      setCart({
        id: 'user-cart',
        userId: user.id,
        items: userCartItems,
        total,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    } else if (!user) {
      loadLocalCart();
    }
  }, [user, userCartItems, loadLocalCart]);

  // Mutations do carrinho - tudo centralizado aqui
  const addToCartMutation = useMutation({
    mutationFn: async ({
      productId,
      quantity,
      showSuccessToast,
    }: {
      productId: string;
      quantity: number;
      showSuccessToast?: boolean;
    }) => {
      if (user) {
        await CartService.addItem(
          user.id,
          productId,
          quantity
        );
      } else {
        CartService.addToLocalCart(
          productId,
          quantity
        );
      }
    },
    onSuccess: () => {
      if (user) {
        queryClient.invalidateQueries({
          queryKey: CART_QUERY_KEY,
        });
      } else {
        loadLocalCart();
      }
      {
        toast.success(
          'Produto adicionado ao carrinho!'
        );
      }
    },
    onError: (error: Error) => {
      toast.error(
        error.message ||
          'Erro ao adicionar ao carrinho'
      );
    },
  });

  const updateQuantityMutation = useMutation({
    mutationFn: async ({
      itemId,
      quantity,
    }: {
      itemId: string;
      quantity: number;
    }) => {
      if (user) {
        await CartService.updateQuantity(
          itemId,
          quantity
        );
      } else {
        CartService.updateLocalCartQuantity(
          itemId,
          quantity
        );
      }
    },
    onSuccess: () => {
      if (user) {
        queryClient.invalidateQueries({
          queryKey: CART_QUERY_KEY,
        });
      } else {
        loadLocalCart();
      }
    },
    onError: (error: Error) => {
      toast.error(
        error.message ||
          'Erro ao atualizar quantidade'
      );
    },
  });

  const removeFromCartMutation = useMutation({
    mutationFn: async (itemId: string) => {
      if (user) {
        await CartService.removeItem(itemId);
      } else {
        CartService.removeFromLocalCart(itemId);
      }
    },
    onSuccess: () => {
      if (user) {
        queryClient.invalidateQueries({
          queryKey: CART_QUERY_KEY,
        });
      } else {
        loadLocalCart();
      }
      toast.success(
        'Produto removido do carrinho!'
      );
    },
    onError: (error: Error) => {
      toast.error(
        error.message ||
          'Erro ao remover do carrinho'
      );
    },
  });

  const clearCartMutation = useMutation({
    mutationFn: async () => {
      if (user) {
        await CartService.clearCart(user.id);
      } else {
        CartService.clearLocalCart();
      }
    },
    onSuccess: () => {
      if (user) {
        queryClient.invalidateQueries({
          queryKey: CART_QUERY_KEY,
        });
      } else {
        setCart(null);
      }
      toast.success('Carrinho limpo!');
    },
    onError: (error: Error) => {
      toast.error(
        error.message || 'Erro ao limpar carrinho'
      );
    },
  });

  const addToCart = useCallback(
    (productId: string, quantity = 1) => {
      addToCartMutation.mutate({
        productId,
        quantity,
      });
    },
    [addToCartMutation]
  );

  const updateQuantity = useCallback(
    (itemId: string, quantity: number) => {
      if (quantity < 1) {
        removeFromCartMutation.mutate(itemId);
      } else {
        updateQuantityMutation.mutate({
          itemId,
          quantity,
        });
      }
    },
    [
      updateQuantityMutation,
      removeFromCartMutation,
    ]
  );

  const removeFromCart = useCallback(
    (itemId: string) => {
      removeFromCartMutation.mutate(itemId);
    },
    [removeFromCartMutation]
  );

  const clearCart = useCallback(() => {
    clearCartMutation.mutate();
  }, [clearCartMutation]);

  const getCartTotal = useCallback(() => {
    return cart?.total || 0;
  }, [cart?.total]);

  const addToCartWhenSignedIn = () => {
    const cart = CartService.getLocalCart();
    if (cart.length === 0) {
      return;
    }
    cart.forEach((item) => {
      addToCart(item.product_id, item.quantity);
    });
    CartService.clearLocalCart();
  };

  // Loading state unificado
  const loading =
    isLoadingUserCart ||
    addToCartMutation.isPending ||
    updateQuantityMutation.isPending ||
    removeFromCartMutation.isPending ||
    clearCartMutation.isPending;

  const value: CartContextType = {
    cart,
    loading,
    addToCart,
    removeFromCart,
    updateQuantity,
    addToCartWhenSignedIn,
    clearCart,
    getCartTotal,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

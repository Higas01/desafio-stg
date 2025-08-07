'use client';

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
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
  const [activeActions, setActiveActions] =
    useState<Set<string>>(new Set());
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const actionTimeouts = useRef<
    Map<string, NodeJS.Timeout>
  >(new Map());

  const CART_QUERY_KEY = [
    'cart',
    user?.id || 'guest',
  ];

  const isActionActive = useCallback(
    (actionKey: string): boolean => {
      return activeActions.has(actionKey);
    },
    [activeActions]
  );

  const setActionActive = useCallback(
    (actionKey: string) => {
      setActiveActions((prev) =>
        new Set(prev).add(actionKey)
      );

      const existingTimeout =
        actionTimeouts.current.get(actionKey);
      if (existingTimeout) {
        clearTimeout(existingTimeout);
      }

      const timeout = setTimeout(() => {
        setActiveActions((prev) => {
          const newSet = new Set(prev);
          newSet.delete(actionKey);
          return newSet;
        });
        actionTimeouts.current.delete(actionKey);
      }, 10000);

      actionTimeouts.current.set(
        actionKey,
        timeout
      );
    },
    []
  );

  const clearActionActive = useCallback(
    (actionKey: string) => {
      setActiveActions((prev) => {
        const newSet = new Set(prev);
        newSet.delete(actionKey);
        return newSet;
      });

      const timeout =
        actionTimeouts.current.get(actionKey);
      if (timeout) {
        clearTimeout(timeout);
        actionTimeouts.current.delete(actionKey);
      }
    },
    []
  );

  const {
    data: userCartItems,
    isLoading: isLoadingUserCart,
  } = useQuery({
    queryKey: CART_QUERY_KEY,
    queryFn: () =>
      CartService.getCartItems(user!.id),
    enabled: !!user,
    staleTime: 1000 * 60 * 5,
  });

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

  const addToCartMutation = useMutation({
    mutationFn: async ({
      productId,
      quantity,
    }: {
      productId: string;
      quantity: number;
    }) => {
      const actionKey = `add-${productId}`;

      if (isActionActive(actionKey)) {
        throw new Error(
          'Ação já está sendo executada'
        );
      }

      setActionActive(actionKey);

      try {
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
        return { productId, quantity, actionKey };
      } finally {
        clearActionActive(actionKey);
      }
    },
    onSuccess: ({ actionKey }) => {
      if (user) {
        queryClient.invalidateQueries({
          queryKey: CART_QUERY_KEY,
        });
      } else {
        loadLocalCart();
      }
    },
    onError: (error: Error) => {
      if (
        error.message !==
        'Ação já está sendo executada'
      ) {
        toast.error(
          error.message ||
            'Erro ao adicionar ao carrinho'
        );
      }
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
      const actionKey = `update-${itemId}`;

      if (isActionActive(actionKey)) {
        throw new Error(
          'Ação já está sendo executada'
        );
      }

      setActionActive(actionKey);

      try {
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
        return { itemId, quantity, actionKey };
      } finally {
        clearActionActive(actionKey);
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
      if (
        error.message !==
        'Ação já está sendo executada'
      ) {
        toast.error(
          error.message ||
            'Erro ao atualizar quantidade'
        );
      }
    },
  });

  const removeFromCartMutation = useMutation({
    mutationFn: async (itemId: string) => {
      const actionKey = `remove-${itemId}`;

      if (isActionActive(actionKey)) {
        throw new Error(
          'Ação já está sendo executada'
        );
      }

      setActionActive(actionKey);

      try {
        if (user) {
          await CartService.removeItem(itemId);
        } else {
          CartService.removeFromLocalCart(itemId);
        }
        return { itemId, actionKey };
      } finally {
        clearActionActive(actionKey);
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
      if (
        error.message !==
        'Ação já está sendo executada'
      ) {
        toast.error(
          error.message ||
            'Erro ao remover do carrinho'
        );
      }
    },
  });

  const clearCartMutation = useMutation({
    mutationFn: async () => {
      const actionKey = 'clear-cart';

      if (isActionActive(actionKey)) {
        throw new Error(
          'Ação já está sendo executada'
        );
      }

      setActionActive(actionKey);

      try {
        if (user) {
          await CartService.clearCart(user.id);
        } else {
          CartService.clearLocalCart();
        }
        return { actionKey };
      } finally {
        clearActionActive(actionKey);
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
      if (
        error.message !==
        'Ação já está sendo executada'
      ) {
        toast.error(
          error.message ||
            'Erro ao limpar carrinho'
        );
      }
    },
  });

  const addToCart = useCallback(
    (productId: string, quantity = 1) => {
      const actionKey = `add-${productId}`;
      if (isActionActive(actionKey)) {
        return;
      }
      addToCartMutation.mutate({
        productId,
        quantity,
      });
    },
    [addToCartMutation, isActionActive]
  );

  const removeFromCart = useCallback(
    (itemId: string) => {
      const actionKey = `remove-${itemId}`;
      if (isActionActive(actionKey)) {
        return;
      }
      removeFromCartMutation.mutate(itemId);
    },
    [removeFromCartMutation, isActionActive]
  );

  const updateQuantity = useCallback(
    (itemId: string, quantity: number) => {
      const actionKey = `update-${itemId}`;
      if (isActionActive(actionKey)) {
        return;
      }

      if (quantity < 1) {
        removeFromCart(itemId);
      } else {
        updateQuantityMutation.mutate({
          itemId,
          quantity,
        });
      }
    },
    [
      updateQuantityMutation,
      isActionActive,
      removeFromCart,
    ]
  );

  const clearCart = useCallback(() => {
    if (!cart || isActionActive('clear-cart')) {
      return;
    }
    clearCartMutation.mutate();
  }, [clearCartMutation, cart, isActionActive]);

  const getCartTotal = useCallback(() => {
    return cart?.total || 0;
  }, [cart?.total]);

  const addToCartWhenSignedIn =
    useCallback(() => {
      const localCart =
        CartService.getLocalCart();
      if (localCart.length === 0) {
        return false;
      }
      localCart.forEach((item) => {
        addToCart(item.product_id, item.quantity);
      });
      CartService.clearLocalCart();
      return true;
    }, [addToCart]);

  const loading =
    activeActions.size > 0 || isLoadingUserCart;

  const value: CartContextType = {
    cart,
    addToCart,
    loading,
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

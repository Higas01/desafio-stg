'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { ShoppingCart, User } from 'lucide-react';
import CartModal from './CartModal';

interface UserActionsProps {
  onAuthClick: () => void;
}

const UserActionsContent: React.FC<
  UserActionsProps
> = ({ onAuthClick }) => {
  const { user, signOut } = useAuth();
  const { cart } = useCart();
  const [showCartModal, setShowCartModal] =
    useState(false);

  const cartItemCount =
    cart?.items.reduce(
      (count, item) => count + item.quantity,
      0
    ) || 0;

  const handleAuthAction = () => {
    if (user) {
      signOut();
    } else {
      onAuthClick();
    }
  };

  return (
    <>
      <div className="flex items-center space-x-4">
        {/* Cart Button */}
        <button
          onClick={() => setShowCartModal(true)}
          className="btn btn-outline btn-md relative"
          aria-label="Carrinho de compras"
        >
          <ShoppingCart className="h-5 w-5" />
          {cartItemCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-primary-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
              {cartItemCount}
            </span>
          )}
        </button>

        {/* Auth Button */}
        <button
          onClick={handleAuthAction}
          className="btn btn-primary btn-md flex items-center space-x-2"
        >
          <User className="h-5 w-5" />
          <span className="hidden sm:inline">
            {user ? 'Sair' : 'Entrar'}
          </span>
        </button>
      </div>

      {/* Cart Modal */}
      <CartModal
        isOpen={showCartModal}
        onClose={() => setShowCartModal(false)}
      />
    </>
  );
};

const UserActions: React.FC<UserActionsProps> = (
  props
) => {
  return (
    <>
      {
        <div className="flex items-center space-x-4">
          <button
            className="btn btn-outline btn-md"
            disabled
            aria-label="Carrinho de compras"
          >
            <ShoppingCart className="h-5 w-5" />
          </button>
          <button
            className="btn btn-primary btn-md flex items-center space-x-2"
            disabled
          >
            <User className="h-5 w-5" />
            <span className="hidden sm:inline">
              Entrar
            </span>
          </button>
        </div>
      }
      <UserActionsContent {...props} />
    </>
  );
};

export default UserActions;

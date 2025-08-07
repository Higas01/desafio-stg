'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import {
  ShoppingCart,
  User,
  Menu,
  X,
  Sun,
  Moon,
  LogOut,
  ChevronDown,
} from 'lucide-react';
import { useDarkMode } from '@/hooks/useCommon';
import CartModal from './CartModal';
import { SkeletonHeader } from './Skeleton';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface HeaderProps {
  onAuthClick: () => void;
  isLoading: boolean;
}

const Header: React.FC<HeaderProps> = ({
  onAuthClick,
  isLoading,
}) => {
  const { user, signOut } = useAuth();
  const { cart } = useCart();
  const [isDark, setIsDark] = useDarkMode();
  const [showCartModal, setShowCartModal] =
    useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] =
    useState(false);
  const [showUserMenu, setShowUserMenu] =
    useState(false);
  const [isLoggingOut, setIsLoggingOut] =
    useState(false);
  const router = useRouter();

  const cartItemCount =
    cart?.items.reduce(
      (count, item) => count + item.quantity,
      0
    ) || 0;

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await signOut();
    setShowUserMenu(false);
    setIsMobileMenuOpen(false);
    setIsLoggingOut(false);
    router.push('/');
  };

  const handleAuthAction = () => {
    if (user) {
      setShowUserMenu(!showUserMenu);
    } else {
      onAuthClick();
    }
  };

  if (isLoading) {
    return <SkeletonHeader />;
  }

  return (
    <>
      {/* Header com posicionamento fixo melhorado */}
      <header className="fixed top-0 left-0 right-0 bg-white dark:bg-gray-800 shadow-md z-50 border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center flex-shrink-0">
              <h1 className="text-xl font-bold text-green-600 dark:text-green-400">
                STG Catalog
              </h1>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4">
              {/* Navigation Links */}
              {user && (
                <nav className="flex items-center space-x-4">
                  <Link
                    href="/"
                    className="text-gray-700 dark:text-gray-200 hover:text-green-600 dark:hover:text-green-400 transition-colors"
                  >
                    Produtos
                  </Link>
                  <Link
                    href="/pedidos"
                    className="text-gray-700 dark:text-gray-200 hover:text-green-600 dark:hover:text-green-400 transition-colors"
                  >
                    Pedidos
                  </Link>
                </nav>
              )}

              {/* Theme Toggle */}
              <button
                onClick={() => setIsDark(!isDark)}
                className="btn btn-ghost btn-sm"
                aria-label="Toggle theme"
              >
                {isDark ? (
                  <Sun className="h-4 w-4" />
                ) : (
                  <Moon className="h-4 w-4" />
                )}
              </button>

              {/* Cart */}
              <button
                onClick={() =>
                  setShowCartModal(true)
                }
                className="btn btn-ghost btn-sm relative"
                aria-label="Shopping cart"
              >
                <ShoppingCart className="h-5 w-5" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-green-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartItemCount}
                  </span>
                )}
              </button>

              {/* User Menu */}
              <div className="relative">
                <button
                  onClick={handleAuthAction}
                  className="btn btn-ghost btn-sm flex items-center space-x-2"
                >
                  <User className="h-4 w-4" />
                  <span>
                    {user ? user.name : 'Entrar'}
                  </span>
                  {user && (
                    <ChevronDown className="h-3 w-3" />
                  )}
                </button>

                {/* Desktop User Dropdown */}
                {user && showUserMenu && (
                  <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 z-50">
                    <div className="py-1">
                      <div className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700">
                        <p className="font-medium text-gray-900 dark:text-white truncate mb-1">
                          {user.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 break-all leading-tight">
                          {user.email}
                        </p>
                      </div>
                      <button
                        onClick={handleLogout}
                        disabled={isLoggingOut}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-2"
                      >
                        {isLoggingOut ? (
                          <>
                            <div className="w-4 h-4 bg-red-300 rounded animate-pulse flex-shrink-0" />
                            <span>Saindo...</span>
                          </>
                        ) : (
                          <>
                            <LogOut className="h-4 w-4 flex-shrink-0" />
                            <span>Sair</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex-shrink-0">
              <button
                onClick={() =>
                  setIsMobileMenuOpen(
                    !isMobileMenuOpen
                  )
                }
                className="btn btn-ghost btn-sm"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              <div className="px-2 pt-2 pb-3 space-y-1 max-h-[calc(100vh-4rem)] overflow-y-auto">
                {/* Cart */}
                <button
                  onClick={() => {
                    setShowCartModal(true);
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-between px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md transition-colors"
                >
                  <div className="flex items-center">
                    <ShoppingCart className="h-5 w-5 mr-3 flex-shrink-0" />
                    Carrinho
                  </div>
                  {cartItemCount > 0 && (
                    <span className="bg-green-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center flex-shrink-0">
                      {cartItemCount}
                    </span>
                  )}
                </button>

                {/* Theme Toggle */}
                <button
                  onClick={() => {
                    setIsDark(!isDark);
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md transition-colors"
                >
                  {isDark ? (
                    <>
                      <Sun className="h-5 w-5 mr-3 flex-shrink-0" />
                      Modo Claro
                    </>
                  ) : (
                    <>
                      <Moon className="h-5 w-5 mr-3 flex-shrink-0" />
                      Modo Escuro
                    </>
                  )}
                </button>

                {/* User Section Mobile */}
                {user ? (
                  <>
                    {/* User Info */}
                    <div className="px-3 py-3 border-b border-gray-200 dark:border-gray-700">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate mb-1">
                        {user.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 break-all leading-tight">
                        {user.email}
                      </p>
                    </div>
                    {/* Logout Button */}
                    <button
                      onClick={handleLogout}
                      disabled={isLoggingOut}
                      className="w-full flex items-center px-3 py-2 text-base font-medium text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
                    >
                      {isLoggingOut ? (
                        <>
                          <div className="w-5 h-5 mr-3 bg-red-300 rounded animate-pulse flex-shrink-0" />
                          <span>Saindo...</span>
                        </>
                      ) : (
                        <>
                          <LogOut className="h-5 w-5 mr-3 flex-shrink-0" />
                          <span>Sair</span>
                        </>
                      )}
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => {
                      onAuthClick();
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md transition-colors"
                  >
                    <User className="h-5 w-5 mr-3 flex-shrink-0" />
                    Entrar
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Spacer para compensar o header fixo */}
      <div className="h-16" />

      {/* Overlay para fechar dropdown quando clicar fora */}
      {showUserMenu && (
        <div
          className="fixed inset-0 z-30"
          onClick={() => setShowUserMenu(false)}
        />
      )}

      {/* Cart Modal */}
      {showCartModal && (
        <CartModal
          isOpen={showCartModal}
          onClose={() => setShowCartModal(false)}
        />
      )}
    </>
  );
};

export default Header;

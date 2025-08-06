'use client';

import { useState } from 'react';
import { Product } from '@/types';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import {
  ShoppingCart,
  Plus,
  Minus,
  Heart,
  Eye,
} from 'lucide-react';
import { formatCurrency } from '@/utils';
import Image from 'next/image';
import Link from 'next/link';
import toast from 'react-hot-toast';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
}) => {
  const { addToCart, loading } = useCart();
  const { user } = useAuth();
  const [quantity, setQuantity] = useState(1);
  const [imageError, setImageError] =
    useState(false);
  const [isWishlisted, setIsWishlisted] =
    useState(false);

  const handleAddToCart = async () => {
    try {
      await addToCart(product.id, quantity);
      setQuantity(1);
    } catch (error) {
      console.error(
        'Error adding to cart:',
        error
      );
    }
  };

  const handleQuantityChange = (
    delta: number
  ) => {
    const newQuantity = quantity + delta;
    if (newQuantity >= 1) {
      setQuantity(newQuantity);
    }
  };

  const toggleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    toast.success(
      isWishlisted
        ? 'Produto removido da lista de desejos'
        : 'Produto adicionado à lista de desejos'
    );
  };

  return (
    <div className="card group hover:shadow-lg transition-shadow duration-300 animate-fade-in h-full flex flex-col">
      {/* Imagem - Altura fixa */}
      <div className="relative aspect-square overflow-hidden rounded-t-lg flex-shrink-0">
        {!imageError ? (
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            onError={() => setImageError(true)}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
            <div className="text-gray-400 text-center">
              <div className="w-12 h-12 mx-auto mb-2 bg-gray-300 dark:bg-gray-600 rounded"></div>
              <span className="text-sm">
                Imagem não disponível
              </span>
            </div>
          </div>
        )}

        {/* Wishlist Button */}
        <button
          onClick={toggleWishlist}
          className="absolute top-2 right-2 p-2 bg-white dark:bg-gray-800 rounded-full shadow-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors opacity-0 group-hover:opacity-100"
          aria-label="Add to wishlist"
        >
          <Heart
            className={`h-4 w-4 ${
              isWishlisted
                ? 'fill-red-500 text-red-500'
                : 'text-gray-600 dark:text-gray-400'
            }`}
          />
        </button>
      </div>

      {/* Conteúdo - Flex para ocupar espaço restante */}
      <div className="card-content flex flex-col flex-grow">
        {/* Categoria - Altura fixa */}
        <div className="mb-2 flex-shrink-0">
          <span className="text-xs text-primary-600 dark:text-primary-400 font-medium uppercase tracking-wide">
            {product.category}
          </span>
        </div>

        {/* Título - Altura fixa com */}
        <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-2 flex-shrink-0 min-h-[3.5rem]">
          {product.name}
        </h3>

        {/* Descrição - Altura fixa com e ellipsis */}
        <div className="flex-shrink-0 min-h-[3.5rem] mb-3">
          <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed overflow-hidden text-ellipsis">
            {product.description.length > 200
              ? product.description.slice(
                  0,
                  200
                ) + '...'
              : product.description}
          </p>
        </div>

        {/* Preço - Altura fixa */}
        <div className="flex items-center justify-between mb-3 flex-shrink-0">
          <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">
            {formatCurrency(product.price)}
          </span>
        </div>

        {/* Área flexível para empurrar botões para baixo */}
        <div className="flex-grow"></div>

        {/* Controles e Botões - Sempre no final */}
        <div className="flex-shrink-0">
          {/* Quantity Selector */}
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Quantidade:
            </span>
            <div className="flex items-center space-x-2">
              <button
                onClick={() =>
                  handleQuantityChange(-1)
                }
                disabled={quantity <= 1}
                className="btn btn-outline btn-sm w-8 h-8 p-0 flex items-center justify-center disabled:opacity-50"
              >
                <Minus className="h-3 w-3" />
              </button>
              <span className="w-8 text-center font-medium">
                {quantity}
              </span>
              <button
                onClick={() =>
                  handleQuantityChange(1)
                }
                className="btn btn-outline btn-sm w-8 h-8 p-0 flex items-center justify-center"
              >
                <Plus className="h-3 w-3" />
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2">
            {/* Ver Detalhes Button */}
            <Link
              href={`/produto/${product.id}`}
              className="btn btn-outline btn-md w-full flex items-center justify-center"
            >
              <Eye className="h-4 w-4 mr-2" />
              Ver Detalhes
            </Link>

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              disabled={loading}
              className="btn btn-primary btn-md w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="w-4 h-4 mr-2 bg-white/30 rounded animate-pulse" />
              ) : (
                <ShoppingCart className="h-4 w-4 mr-2" />
              )}
              Adicionar ao Carrinho
            </button>

            {!user && (
              <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-1">
                Faça login para finalizar compras
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;

'use client';

import { useState, useEffect } from 'react';
import {
  useParams,
  useRouter,
} from 'next/navigation';
import { Product } from '@/types';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import {
  ShoppingCart,
  Plus,
  Minus,
  ArrowLeft,
  Heart,
  Share2,
  Star,
} from 'lucide-react';
import { formatCurrency } from '@/utils';
import Image from 'next/image';
import toast from 'react-hot-toast';
import { useProductGetById } from '@/hooks/useProducts';
import { SkeletonProductDetail } from '@/components/Skeleton';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { addToCart, loading: cartLoading } =
    useCart();
  const { user } = useAuth();

  const [quantity, setQuantity] = useState(1);
  const [imageError, setImageError] =
    useState(false);
  const [isWishlisted, setIsWishlisted] =
    useState(false);

  const productId = params?.id as string;
  const { product, loading } =
    useProductGetById(productId);
  const [selectedProduct, setSelectedProduct] =
    useState<Product | null>(null);
  useEffect(() => {
    if (!loading) {
      if (!product) {
        router.push('/');
      } else {
        setSelectedProduct(product);
      }
    }
  }, [product, loading, router]);
  const handleAddToCart = async () => {
    if (!selectedProduct) return;
    await addToCart(selectedProduct.id, quantity);
    setQuantity(1);
    toast.success(
      'Produto adicionado ao carrinho!'
    );
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

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: product?.name,
        text: product?.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(
        window.location.href
      );
      toast.success(
        'Link copiado para a área de transferência!'
      );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <SkeletonProductDetail />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Produto não encontrado</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-shadow duration-300 animate-fade-in">
      <div className="container py-8">
        <div className="mb-6">
          <button
            onClick={() => router.back()}
            className="btn btn-outline btn-sm flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Voltar</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="relative aspect-square overflow-hidden rounded-xl bg-white dark:bg-gray-800 shadow-lg">
              {!imageError ? (
                <Image
                  src={product.image_url}
                  alt={product.name}
                  fill
                  className="object-cover"
                  onError={() =>
                    setImageError(true)
                  }
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-200 dark:bg-gray-700">
                  <div className="text-center text-gray-400">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gray-300 dark:bg-gray-600 rounded"></div>
                    <span>
                      Imagem não disponível
                    </span>
                  </div>
                </div>
              )}

              <div className="absolute top-4 right-4 flex space-x-2">
                <button
                  onClick={toggleWishlist}
                  className="p-2 bg-white dark:bg-gray-800 rounded-full shadow-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <Heart
                    className={`h-5 w-5 ${
                      isWishlisted
                        ? 'fill-red-500 text-red-500'
                        : 'text-gray-600 dark:text-gray-400'
                    }`}
                  />
                </button>
                <button
                  onClick={handleShare}
                  className="p-2 bg-white dark:bg-gray-800 rounded-full shadow-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <Share2 className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <span className="inline-block px-3 py-1 text-xs font-medium text-primary-600 dark:text-primary-400 bg-primary-100 dark:bg-primary-900 rounded-full uppercase tracking-wide">
                {product.category}
              </span>
            </div>

            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {product.name}
            </h1>

            <div className="flex items-center space-x-2">
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className="h-5 w-5 fill-yellow-400 text-yellow-400"
                  />
                ))}
              </div>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                (4.8) • 124 avaliações
              </span>
            </div>

            <div className="text-4xl font-bold text-primary-600 dark:text-primary-400">
              {formatCurrency(product.price)}
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Descrição
              </h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                {product.description}
              </p>
            </div>

            <div className="flex items-center space-x-4">
              <span className="text-lg font-medium text-gray-700 dark:text-gray-300">
                Quantidade:
              </span>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() =>
                    handleQuantityChange(-1)
                  }
                  disabled={quantity <= 1}
                  className="btn btn-outline btn-sm w-10 h-10 p-0 flex items-center justify-center disabled:opacity-50"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-12 text-center font-semibold text-lg">
                  {quantity}
                </span>
                <button
                  onClick={() =>
                    handleQuantityChange(1)
                  }
                  className="btn btn-outline btn-sm w-10 h-10 p-0 flex items-center justify-center"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <button
                onClick={handleAddToCart}
                disabled={cartLoading}
                className="btn btn-primary btn-lg w-full disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {cartLoading ? (
                  <div className="w-5 h-5 mr-3 bg-white/30 rounded animate-pulse" />
                ) : (
                  <ShoppingCart className="h-5 w-5 mr-3" />
                )}
                Adicionar ao Carrinho
              </button>

              {!user && (
                <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                  <span className="text-yellow-600 dark:text-yellow-400">
                    ⚠️ Você pode adicionar ao
                    carrinho, mas precisa fazer
                    login para finalizar a compra
                  </span>
                </p>
              )}
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Informações do Produto
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    ID do Produto:
                  </span>
                  <span className="text-gray-900 dark:text-white font-mono">
                    {product.id}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    Categoria:
                  </span>
                  <span className="text-gray-900 dark:text-white">
                    {product.category}
                  </span>
                </div>
                {product.created_at && (
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      Adicionado em:
                    </span>
                    <span className="text-gray-900 dark:text-white">
                      {new Date(
                        product.created_at
                      ).toLocaleDateString(
                        'pt-BR'
                      )}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

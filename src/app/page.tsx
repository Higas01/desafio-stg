'use client';

import { Suspense } from 'react';
import ProductGrid from '@/components/ProductGrid';
import { SkeletonGrid } from '@/components/Skeleton';
import {
  ShoppingBag,
  Star,
  TrendingUp,
  Users,
  Sparkles,
} from 'lucide-react';

export default function HomePage() {
  const scrollToProdutos = () => {
    const produtosSection =
      document.getElementById('produtos');
    if (produtosSection) {
      produtosSection.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 dark:from-primary-700 dark:to-primary-900 text-white">
        <div className="container py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Hero Content */}
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Sparkles className="h-6 w-6 text-yellow-300" />
                  <span className="text-yellow-300 font-medium">
                    Bem-vindo ao nosso catálogo
                  </span>
                </div>

                <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                  Descubra produtos
                  <span className="block text-yellow-300">
                    incríveis
                  </span>
                </h1>

                <p className="text-xl text-primary-100 leading-relaxed max-w-md">
                  Explore nossa coleção exclusiva
                  de produtos selecionados
                  especialmente para você.
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={scrollToProdutos}
                  className="btn btn-secondary btn-lg px-8 py-4 text-lg font-semibold hover:scale-105 transition-transform duration-300"
                >
                  <ShoppingBag className="h-5 w-5 mr-3" />
                  Ver Produtos
                </button>
              </div>
            </div>

            {/* Hero Stats */}
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/20">
                <div className="flex justify-center mb-4">
                  <div className="w-12 h-12 bg-yellow-300 rounded-full flex items-center justify-center">
                    <Star className="h-6 w-6 text-primary-600" />
                  </div>
                </div>
                <h3 className="text-3xl font-bold mb-2">
                  4.8
                </h3>
                <p className="text-primary-100">
                  Avaliação média
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/20">
                <div className="flex justify-center mb-4">
                  <div className="w-12 h-12 bg-green-300 rounded-full flex items-center justify-center">
                    <Users className="h-6 w-6 text-primary-600" />
                  </div>
                </div>
                <h3 className="text-3xl font-bold mb-2">
                  1000+
                </h3>
                <p className="text-primary-100">
                  Clientes felizes
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/20">
                <div className="flex justify-center mb-4">
                  <div className="w-12 h-12 bg-blue-300 rounded-full flex items-center justify-center">
                    <ShoppingBag className="h-6 w-6 text-primary-600" />
                  </div>
                </div>
                <h3 className="text-3xl font-bold mb-2">
                  500+
                </h3>
                <p className="text-primary-100">
                  Produtos
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/20">
                <div className="flex justify-center mb-4">
                  <div className="w-12 h-12 bg-purple-300 rounded-full flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-primary-600" />
                  </div>
                </div>
                <h3 className="text-3xl font-bold mb-2">
                  24h
                </h3>
                <p className="text-primary-100">
                  Entrega rápida
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Wave Decoration */}
        <div className="relative">
          <svg
            className="w-full h-16 text-gray-50 dark:text-gray-900"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
          >
            <path
              d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
              opacity=".25"
              fill="currentColor"
            />
            <path
              d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z"
              opacity=".5"
              fill="currentColor"
            />
            <path
              d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z"
              fill="currentColor"
            />
          </svg>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Por que escolher nossos produtos?
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Oferecemos qualidade excepcional,
              preços competitivos e uma
              experiência de compra única
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <ShoppingBag className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                Variedade de Produtos
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Mais de 500 produtos
                cuidadosamente selecionados para
                atender todas as suas necessidades
              </p>
            </div>

            {/* Feature 2 */}
            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Star className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                Qualidade Garantida
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Todos os produtos passam por
                rigoroso controle de qualidade
                antes de chegar até você
              </p>
            </div>

            {/* Feature 3 */}
            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <TrendingUp className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                Entrega Rápida
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Receba seus produtos em até 24
                horas com nosso sistema de entrega
                otimizado
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section
        id="produtos"
        className="py-16 bg-gray-50 dark:bg-gray-900"
      >
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Nossos Produtos
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Explore nossa coleção completa de
              produtos de alta qualidade
            </p>
          </div>

          <ProductGrid />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary-600 to-primary-700 dark:from-primary-700 dark:to-primary-800">
        <div className="container text-center">
          <div className="max-w-3xl mx-auto space-y-8">
            <h2 className="text-4xl font-bold text-white">
              Pronto para começar suas compras?
            </h2>
            <p className="text-xl text-primary-100">
              Junte-se a milhares de clientes
              satisfeitos e descubra a diferença
              em cada compra
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center"></div>
          </div>
        </div>
      </section>
    </div>
  );
}

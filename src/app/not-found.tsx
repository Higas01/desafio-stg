'use client';

import Link from 'next/link';
import { Home, AlertCircle } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center px-4">
      <div className="max-w-lg w-full text-center space-y-12 animate-fade-in">
        <div className="relative">
          <div className="w-48 h-48 mx-auto bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-900/30 dark:to-primary-800/20 rounded-full flex items-center justify-center shadow-lg">
            <div className="w-32 h-32 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center shadow-inner">
              <AlertCircle className="w-16 h-16 text-primary-600 dark:text-primary-400" />
            </div>
          </div>

          <div className="absolute -top-6 -right-6 bg-gradient-to-r from-red-500 to-red-600 text-white text-2xl font-bold px-6 py-3 rounded-full shadow-lg animate-bounce">
            404
          </div>

          <div className="absolute top-8 left-8 w-3 h-3 bg-primary-400 rounded-full animate-ping"></div>
          <div className="absolute bottom-12 right-8 w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
          <div
            className="absolute top-1/2 -left-4 w-4 h-4 bg-green-400 rounded-full animate-bounce"
            style={{ animationDelay: '0.5s' }}
          ></div>
        </div>

        <div className="space-y-6">
          <div className="space-y-4">
            <h1 className="text-5xl font-bold text-gray-900 dark:text-white tracking-tight">
              Oops!
            </h1>
            <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300">
              Página não encontrada
            </h2>
          </div>

          <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed max-w-md mx-auto">
            A página que você está procurando não
            existe ou foi movida para outro local.
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="group btn btn-primary btn-lg px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              <Home className="w-5 h-5 mr-3 group-hover:animate-pulse" />
              Ir para o Início
            </Link>
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-6 border border-blue-200 dark:border-blue-800/30">
          <div className="space-y-3">
            <div className="flex items-center justify-center space-x-2">
              <span className="text-2xl">💡</span>
              <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-300">
                Dica
              </h3>
            </div>
            <p className="text-blue-700 dark:text-blue-400 leading-relaxed">
              Verifique se o endereço foi digitado
              corretamente ou navegue pelo menu
              principal para encontrar o que você
              procura.
            </p>
          </div>
        </div>

        <div className="flex justify-center items-center space-x-2 opacity-40">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="w-1.5 h-1.5 bg-primary-500 rounded-full animate-pulse"
              style={{
                animationDelay: `${i * 0.15}s`,
                animationDuration: '2s',
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

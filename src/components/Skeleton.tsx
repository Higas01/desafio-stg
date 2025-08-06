import React from 'react';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'rectangular' | 'circular';
  width?: string | number;
  height?: string | number;
  lines?: number;
}

const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  variant = 'rectangular',
  width,
  height,
  lines = 1,
}) => {
  const baseClasses =
    'animate-pulse bg-gray-200 dark:bg-gray-700';

  const variantClasses = {
    text: 'rounded-md h-4',
    rectangular: 'rounded-lg',
    circular: 'rounded-full',
  };

  const style: React.CSSProperties = {};
  if (width)
    style.width =
      typeof width === 'number'
        ? `${width}px`
        : width;
  if (height)
    style.height =
      typeof height === 'number'
        ? `${height}px`
        : height;

  if (variant === 'text' && lines > 1) {
    return (
      <div className={`space-y-2 ${className}`}>
        {Array.from({ length: lines }).map(
          (_, index) => (
            <div
              key={index}
              className={`${baseClasses} ${
                variantClasses[variant]
              } ${
                index === lines - 1
                  ? 'w-3/4'
                  : 'w-full'
              }`}
              style={
                index === 0 ? style : undefined
              }
            />
          )
        )}
      </div>
    );
  }

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      style={style}
    />
  );
};

// Skeleton para Card de Produto
export const SkeletonCard: React.FC<{
  className?: string;
}> = ({ className = '' }) => (
  <div
    className={`p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 ${className}`}
  >
    {/* Imagem do produto */}
    <Skeleton
      variant="rectangular"
      height={200}
      className="mb-4 rounded-lg"
    />

    {/* Nome do produto */}
    <Skeleton
      variant="text"
      lines={2}
      className="mb-3"
    />

    {/* Categoria */}
    <Skeleton
      variant="text"
      width="60%"
      className="mb-2 h-3"
    />

    {/* Preço e botão */}
    <div className="flex justify-between items-center mt-4">
      <Skeleton
        variant="text"
        width={80}
        className="h-6"
      />
      <Skeleton
        variant="rectangular"
        width={120}
        height={36}
        className="rounded-md"
      />
    </div>
  </div>
);

// Skeleton para Grid de Produtos
export const SkeletonGrid: React.FC<{
  count?: number;
  className?: string;
}> = ({ count = 15, className = '' }) => (
  <div
    className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 ${className}`}
  >
    {Array.from({ length: count }).map(
      (_, index) => (
        <SkeletonCard key={index} />
      )
    )}
  </div>
);

// Skeleton para Detalhes do Produto
export const SkeletonProductDetail: React.FC<{
  className?: string;
}> = ({ className = '' }) => (
  <div
    className={`grid grid-cols-1 lg:grid-cols-2 gap-8 ${className}`}
  >
    {/* Imagem do produto */}
    <div className="space-y-4">
      <Skeleton
        variant="rectangular"
        height={300}
        width={768}
        className="rounded-xl"
      />
      {/* Thumbnails */}
      <div className="flex space-x-2">
        {Array.from({ length: 3 }).map(
          (_, index) => (
            <Skeleton
              key={index}
              variant="rectangular"
              width={80}
              height={80}
              className="rounded-lg"
            />
          )
        )}
      </div>
    </div>

    {/* Detalhes do produto */}
    <div className="space-y-6">
      {/* Título */}
      <Skeleton
        variant="text"
        lines={2}
        className="text-2xl"
      />

      {/* Categoria e avaliação */}
      <div className="flex items-center space-x-4">
        <Skeleton variant="text" width={100} />
        <Skeleton variant="text" width={80} />
      </div>

      {/* Descrição */}
      <Skeleton variant="text" lines={4} />

      {/* Preço */}
      <Skeleton
        variant="text"
        width={120}
        className="h-8"
      />

      {/* Controles de quantidade e botões */}
      <div className="space-y-4">
        <div className="flex items-center space-x-4">
          <Skeleton
            variant="rectangular"
            height={40}
            width={120}
            className="rounded-lg"
          />
        </div>

        <div className="flex space-x-4">
          <Skeleton
            variant="rectangular"
            height={40}
            width={150}
            className="rounded-lg"
          />
          <Skeleton
            variant="rectangular"
            height={40}
            className="flex-1 rounded-lg"
          />
        </div>
      </div>
    </div>
  </div>
);

// Skeleton para Lista de Itens (ex: carrinho)
export const SkeletonList: React.FC<{
  count?: number;
  className?: string;
}> = ({ count = 3, className = '' }) => (
  <div className={`space-y-4 ${className}`}>
    {Array.from({ length: count }).map(
      (_, index) => (
        <div
          key={index}
          className="flex items-center space-x-4 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
        >
          {/* Imagem do produto */}
          <Skeleton
            variant="rectangular"
            width={80}
            height={80}
            className="rounded-lg"
          />

          {/* Detalhes do produto */}
          <div className="flex-1 space-y-2">
            <Skeleton variant="text" />
            <Skeleton
              variant="text"
              width="60%"
            />
            <div className="flex justify-between items-center">
              <Skeleton
                variant="text"
                width={80}
              />
              <Skeleton
                variant="rectangular"
                width={100}
                height={32}
                className="rounded-md"
              />
            </div>
          </div>
        </div>
      )
    )}
  </div>
);

// Skeleton para Header
export const SkeletonHeader: React.FC<{
  className?: string;
}> = ({ className = '' }) => (
  <header
    className={`bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 ${className}`}
  >
    <div className="container mx-auto px-4">
      <div className="flex items-center justify-between h-16">
        {/* Logo */}
        <Skeleton
          variant="text"
          width={120}
          className="h-8"
        />

        {/* Actions */}
        <div className="flex items-center space-x-4">
          <Skeleton
            variant="circular"
            width={40}
            height={40}
          />
          <Skeleton
            variant="circular"
            width={40}
            height={40}
          />
          <Skeleton
            variant="circular"
            width={40}
            height={40}
          />
        </div>
      </div>
    </div>
  </header>
);

// Skeleton para Search Bar
export const SkeletonSearch: React.FC<{
  className?: string;
}> = ({ className = '' }) => (
  <div className={`w-full ${className}`}>
    <Skeleton
      variant="rectangular"
      height={48}
      className="rounded-lg"
    />
  </div>
);
export const OrderCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 animate-pulse">
      {/* Header */}
      <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-2 sm:space-y-0">
              <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-24"></div>
              <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-32"></div>
            </div>
            <div className="mt-2">
              <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded-full w-20"></div>
            </div>
          </div>
          <div className="ml-4">
            <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-20 mb-1"></div>
            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-16"></div>
          </div>
        </div>
      </div>

      {/* Items Preview */}
      <div className="p-4 sm:p-6">
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="flex items-center space-x-3"
            >
              <div className="w-12 h-12 bg-gray-300 dark:bg-gray-600 rounded-md flex-shrink-0"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4 mb-1"></div>
                <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-1/2"></div>
              </div>
              <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-16"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="px-4 sm:px-6 py-3 bg-gray-50 dark:bg-gray-700/50 rounded-b-lg border-t border-gray-200 dark:border-gray-600">
        <div className="flex space-x-2">
          <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded flex-1"></div>
          <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded w-20"></div>
        </div>
      </div>
    </div>
  );
};

export default Skeleton;

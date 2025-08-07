'use client';

import { useProducts } from '@/hooks/useProducts';
import { useProductFilters } from '@/hooks/useProductFilters';
import ProductCard from './ProductCard';
import ProductFilters from './ProductFilters';
import { SkeletonGrid } from './Skeleton';
import { Search } from 'lucide-react';

const ProductGrid: React.FC = () => {
  const {
    products,
    loading,
    error,
    searchProducts,
    getCategories,
  } = useProducts();

  const {
    searchTerm,
    selectedCategory,
    priceRange,
    hasActiveFilters,
    categories,
    priceRanges,
    filteredProducts,
    handleSearchChange,
    handleCategoryChange,
    handlePriceRangeChange,
    clearAllFilters,
  } = useProductFilters({
    products,
    searchProducts,
    getCategories,
  });

  if (error) {
    return (
      <div className="text-center py-16">
        <p className="text-red-600 dark:text-red-400 text-lg">
          {error}
        </p>
        <button
          onClick={() => window.location.reload()}
          className="btn btn-primary btn-md mt-4"
        >
          Tentar Novamente
        </button>
      </div>
    );
  }

  if (loading) {
    return <SkeletonGrid />;
  }

  return (
    <div className="space-y-6">
      {/* Filtros */}
      <ProductFilters
        searchTerm={searchTerm}
        selectedCategory={selectedCategory}
        priceRange={priceRange}
        categories={categories}
        priceRanges={priceRanges}
        onSearchChange={handleSearchChange}
        onCategoryChange={handleCategoryChange}
        onPriceRangeChange={
          handlePriceRangeChange
        }
        onClearAllFilters={clearAllFilters}
      />

      {/* Contadores e Ordenação */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600 dark:text-gray-400">
          {filteredProducts.length} produto(s)
          encontrado(s)
        </div>
      </div>

      {/* Grid de Produtos */}
      {filteredProducts.length === 0 &&
      !loading ? (
        <div className="text-center py-16">
          <div className="text-gray-400 mb-4">
            <Search className="h-12 w-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Nenhum produto encontrado
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Tente ajustar seus filtros ou termos
            de busca.
          </p>
          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="btn btn-outline btn-md"
            >
              Limpar todos os filtros
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 items-stretch">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductGrid;

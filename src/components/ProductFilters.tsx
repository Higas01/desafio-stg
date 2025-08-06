'use client';

import { useState } from 'react';
import {
  Search,
  Filter,
  DollarSign,
  X,
} from 'lucide-react';

interface PriceRange {
  min: number;
  max: number;
}

interface ProductFiltersProps {
  searchTerm: string;
  selectedCategory: string;
  priceRange: PriceRange;
  categories: string[];
  priceRanges: Array<{
    label: string;
    min: number;
    max: number;
    custom?: boolean;
  }>;
  onSearchChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onPriceRangeChange: (range: PriceRange) => void;
  onClearAllFilters: () => void;
}

const ProductFilters: React.FC<
  ProductFiltersProps
> = ({
  searchTerm,
  selectedCategory,
  priceRange,
  categories,
  priceRanges,
  onSearchChange,
  onCategoryChange,
  onPriceRangeChange,
  onClearAllFilters,
}) => {
  const [customPriceRange, setCustomPriceRange] =
    useState<PriceRange>({
      min: 0,
      max: 0,
    });
  const [showCustomPrice, setShowCustomPrice] =
    useState(false);

  const handlePriceRangeSelect = (
    range: PriceRange & { custom?: boolean }
  ) => {
    if (range.custom) {
      setShowCustomPrice(true);
      setCustomPriceRange({
        min: range.min,
        max: range.max,
      });
    } else {
      setShowCustomPrice(false);
      onPriceRangeChange(range);
    }
  };

  const applyCustomPriceRange = () => {
    onPriceRangeChange(customPriceRange);
    setShowCustomPrice(false);
  };

  const clearPriceFilter = () => {
    onPriceRangeChange({ min: 0, max: 0 });
    setCustomPriceRange({ min: 0, max: 0 });
    setShowCustomPrice(false);
  };

  const hasActiveFilters =
    searchTerm ||
    selectedCategory ||
    priceRange.min > 0 ||
    priceRange.max > 0;

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
      {/* Main Filters Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Search Filter */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar produtos..."
            value={searchTerm}
            onChange={(e) =>
              onSearchChange(e.target.value)
            }
            className="input pl-10 w-full"
          />
        </div>

        {/* Category Filter */}
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <select
            value={selectedCategory}
            onChange={(e) =>
              onCategoryChange(e.target.value)
            }
            className="input pl-10 w-full appearance-none"
          >
            <option value="">
              Todas as categorias
            </option>
            {categories.map((category) => (
              <option
                key={category}
                value={category}
              >
                {category}
              </option>
            ))}
          </select>
        </div>

        {/* Price Filter */}
        <div className="relative">
          <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <select
            onChange={(e) => {
              const selectedRange =
                priceRanges[
                  parseInt(e.target.value)
                ];
              if (selectedRange) {
                handlePriceRangeSelect(
                  selectedRange
                );
              } else {
                clearPriceFilter();
              }
            }}
            className="input pl-10 w-full appearance-none"
            value={
              priceRange.min === 0 &&
              priceRange.max === 0
                ? ''
                : priceRanges.findIndex(
                    (r) =>
                      r.min === priceRange.min &&
                      r.max === priceRange.max
                  )
            }
          >
            <option value="">
              Todos os preços
            </option>
            {priceRanges.map((range, index) => (
              <option key={index} value={index}>
                {range.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Custom Price Range */}
      {showCustomPrice && (
        <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
          <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
            Faixa de preço personalizada
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
            <div>
              <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                Preço mínimo
              </label>
              <input
                type="number"
                placeholder="0"
                min="0"
                step="0.01"
                value={customPriceRange.min || ''}
                onChange={(e) =>
                  setCustomPriceRange((prev) => ({
                    ...prev,
                    min:
                      parseFloat(
                        e.target.value
                      ) || 0,
                  }))
                }
                className="input w-full"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                Preço máximo
              </label>
              <input
                type="number"
                placeholder="1000"
                min="0"
                step="0.01"
                value={
                  customPriceRange.max ===
                  Infinity
                    ? ''
                    : customPriceRange.max || ''
                }
                onChange={(e) =>
                  setCustomPriceRange((prev) => ({
                    ...prev,
                    max:
                      parseFloat(
                        e.target.value
                      ) || Infinity,
                  }))
                }
                className="input w-full"
              />
            </div>
            <div className="flex space-x-2">
              <button
                onClick={applyCustomPriceRange}
                className="btn btn-primary btn-sm flex-1"
              >
                Aplicar
              </button>
              <button
                onClick={() =>
                  setShowCustomPrice(false)
                }
                className="btn btn-outline btn-sm"
                aria-label="Cancelar"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Active Filters Tags */}
      {hasActiveFilters && (
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Filtros ativos:
          </span>

          {/* Search Tag */}
          {searchTerm && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200">
              {`Busca: "${searchTerm}"`}
              <button
                onClick={() => onSearchChange('')}
                className="ml-1 hover:text-primary-600"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}

          {/* Category Tag */}
          {selectedCategory && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
              Categoria: {selectedCategory}
              <button
                onClick={() =>
                  onCategoryChange('')
                }
                className="ml-1 hover:text-blue-600"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}

          {/* Price Tag */}
          {(priceRange.min > 0 ||
            priceRange.max > 0) && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">
              Preço: R$ {priceRange.min} -{' '}
              {priceRange.max === Infinity
                ? '∞'
                : `R$ ${priceRange.max}`}
              <button
                onClick={clearPriceFilter}
                className="ml-1 hover:text-green-600"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}

          {/* Clear All Button */}
          <button
            onClick={onClearAllFilters}
            className="text-xs text-primary-600 hover:text-primary-700 underline"
          >
            Limpar todos
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductFilters;

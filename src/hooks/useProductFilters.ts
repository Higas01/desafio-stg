import { useState, useMemo } from 'react';
import { Product } from '@/types';
import { useDebounce } from '@/hooks/useCommon';

interface PriceRange {
  min: number;
  max: number;
}

interface ProductFiltersConfig {
  products: Product[];
  searchProducts: (term: string) => Product[];
  getCategories: () => Set<string>;
}

export const useProductFilters = ({
  products,
  searchProducts,
  getCategories,
}: ProductFiltersConfig) => {
  const [searchTerm, setSearchTerm] =
    useState('');
  const [selectedCategory, setSelectedCategory] =
    useState('');
  const [priceRange, setPriceRange] =
    useState<PriceRange>({ min: 0, max: 0 });

  const debouncedSearchTerm = useDebounce(
    searchTerm,
    300
  );

  const priceRanges = useMemo(() => {
    if (products.length === 0) return [];

    const prices = products
      .map((p) => p.price)
      .sort((a, b) => a - b);
    const minPrice = prices[0];
    const maxPrice = prices[prices.length - 1];

    return [
      { label: 'Até R$ 50', min: 0, max: 50 },
      {
        label: 'R$ 50 - R$ 100',
        min: 50,
        max: 100,
      },
      {
        label: 'R$ 100 - R$ 200',
        min: 100,
        max: 200,
      },
      {
        label: 'R$ 200 - R$ 500',
        min: 200,
        max: 500,
      },
      {
        label: 'Acima de R$ 500',
        min: 500,
        max: Infinity,
      },
      {
        label: 'Faixa personalizada',
        min: minPrice,
        max: maxPrice,
        custom: true,
      },
    ];
  }, [products]);

  const filteredProducts = useMemo(() => {
    let result = products;

    if (debouncedSearchTerm) {
      result = searchProducts(
        debouncedSearchTerm
      );
    }

    if (selectedCategory) {
      result = result.filter(
        (product) =>
          product.category === selectedCategory
      );
    }

    if (
      priceRange.min > 0 ||
      priceRange.max > 0
    ) {
      result = result.filter((product) => {
        const price = product.price;
        const min = priceRange.min || 0;
        const max =
          priceRange.max === Infinity
            ? Number.MAX_VALUE
            : priceRange.max;

        return (
          price >= min &&
          (max === Number.MAX_VALUE ||
            price <= max)
        );
      });
    }

    return result;
  }, [
    products,
    debouncedSearchTerm,
    selectedCategory,
    priceRange,
    searchProducts,
  ]);

  const categories = Array.from(getCategories());

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
  };

  const handleCategoryChange = (
    value: string
  ) => {
    setSelectedCategory(value);
  };

  const handlePriceRangeChange = (
    range: PriceRange
  ) => {
    setPriceRange(range);
  };

  const clearAllFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setPriceRange({ min: 0, max: 0 });
  };

  const hasActiveFilters =
    searchTerm ||
    selectedCategory ||
    priceRange.min > 0 ||
    priceRange.max > 0;

  return {
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
  };
};

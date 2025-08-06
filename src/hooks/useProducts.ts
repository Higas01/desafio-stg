import { useQuery } from '@tanstack/react-query';
import { Product } from '@/types';
import { supabase } from '@/services/supabase';
import { ProductService } from '@/http/services/product.service';

const fetchProducts = async (): Promise<
  Product[]
> => {
  return ProductService.getAll();
};

export const useProducts = () => {
  const {
    data: products = [],
    isLoading,
    error,
    refetch,
  } = useQuery<Product[]>({
    queryKey: ['products'],
    queryFn: fetchProducts,
  });

  const searchProducts = (searchTerm: string) => {
    if (!searchTerm.trim()) return products;
    return products.filter((product) =>
      [
        product.name,
        product.description,
        product.category,
      ]
        .join(' ')
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );
  };

  const filterByCategory = (category: string) => {
    if (!category) return products;
    return products.filter(
      (product) => product.category === category
    );
  };

  const getCategories = () => {
    return new Set(
      products.map((p) => p.category)
    );
  };

  return {
    products,
    loading: isLoading,
    error: error?.message ?? null,
    searchProducts,
    filterByCategory,
    getCategories,
    refetch,
  };
};

export const useProductGetById = (id: string) => {
  const { data: product, isLoading } =
    useQuery<Product | null>({
      queryKey: ['product', id],
      queryFn: () => ProductService.getById(id),
      enabled: !!id,
    });

  return {
    product,
    loading: isLoading,
  };
};

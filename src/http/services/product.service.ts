import { supabase } from '@/services/supabase';
import { Product } from '@/types';
import { handleClientError } from '@/handler/errorHandler';

export class ProductService {
  static async getAll(): Promise<Product[]> {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', {
          ascending: false,
        });

      if (error) {
        throw new Error(
          `Erro ao buscar produtos: ${error.message}`
        );
      }

      return data.map((item: any) => ({
        id: item.id,
        name: item.name,
        description: item.description,
        price: item.price,
        image_url: item.image_url,
        category: item.category,
        created_at: item.created_at,
        updated_at: item.updated_at,
      }));
    } catch (error) {
      console.error(
        'ProductService.getAll error:',
        error
      );
      throw new Error(handleClientError(error));
    }
  }

  static async getById(
    id: string
  ): Promise<Product | null> {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null;
        }
        throw new Error(
          `Erro ao buscar produto: ${error.message}`
        );
      }

      return {
        id: data.id,
        name: data.name,
        description: data.description,
        price: data.price,
        image_url: data.image_url,
        category: data.category,
        created_at: data.created_at,
        updated_at: data.updated_at,
      };
    } catch (error) {
      console.error(
        'ProductService.getById error:',
        error
      );
      throw new Error(handleClientError(error));
    }
  }

  static async searchByName(
    query: string
  ): Promise<Product[]> {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .ilike('name', `%${query}%`)
        .order('created_at', {
          ascending: false,
        });

      if (error) {
        throw new Error(
          `Erro ao buscar produtos: ${error.message}`
        );
      }

      return data.map((item: any) => ({
        id: item.id,
        name: item.name,
        description: item.description,
        price: item.price,
        image_url: item.image_url,
        category: item.category,
        created_at: item.created_at,
        updated_at: item.updated_at,
      }));
    } catch (error) {
      console.error(
        'ProductService.searchByName error:',
        error
      );
      throw new Error(handleClientError(error));
    }
  }

  static async getByCategory(
    category: string
  ): Promise<Product[]> {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('category', category)
        .order('created_at', {
          ascending: false,
        });

      if (error) {
        throw new Error(
          `Erro ao buscar produtos por categoria: ${error.message}`
        );
      }

      return data.map((item: any) => ({
        id: item.id,
        name: item.name,
        description: item.description,
        price: item.price,
        image_url: item.image_url,
        category: item.category,
        created_at: item.created_at,
        updated_at: item.updated_at,
      }));
    } catch (error) {
      console.error(
        'ProductService.getByCategory error:',
        error
      );
      throw new Error(handleClientError(error));
    }
  }

  static async getCategories(): Promise<
    string[]
  > {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('category')
        .order('category');

      if (error) {
        throw new Error(
          `Erro ao buscar categorias: ${error.message}`
        );
      }

      const categories = Array.from(
        new Set(data.map((item) => item.category))
      );
      return categories;
    } catch (error) {
      console.error(
        'ProductService.getCategories error:',
        error
      );
      throw new Error(handleClientError(error));
    }
  }
}

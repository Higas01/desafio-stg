import { z } from 'zod';

export const signInSchema = z.object({
  email: z
    .string()
    .min(1, 'Email é obrigatório')
    .email('Email inválido'),
  password: z
    .string()
    .min(
      6,
      'Senha deve ter pelo menos 6 caracteres'
    ),
});

export const signUpSchema = z
  .object({
    name: z
      .string()
      .min(
        2,
        'Nome deve ter pelo menos 2 caracteres'
      )
      .max(100, 'Nome muito longo'),
    email: z
      .string()
      .min(1, 'Email é obrigatório')
      .email('Email inválido'),
    password: z
      .string()
      .min(
        6,
        'Senha deve ter pelo menos 6 caracteres'
      )
      .max(100, 'Senha muito longa'),
    confirmPassword: z
      .string()
      .min(
        6,
        'Confirmação de senha é obrigatória'
      ),
  })
  .refine(
    (data) =>
      data.password === data.confirmPassword,
    {
      message: 'Senhas não coincidem',
      path: ['confirmPassword'],
    }
  );

export const productSchema = z.object({
  id: z.string().uuid(),
  name: z
    .string()
    .min(1, 'Nome do produto é obrigatório')
    .max(255, 'Nome muito longo'),
  description: z
    .string()
    .min(1, 'Descrição é obrigatória')
    .max(1000, 'Descrição muito longa'),
  price: z
    .number()
    .positive('Preço deve ser positivo')
    .max(999999.99, 'Preço muito alto'),
  image_url: z
    .string()
    .url('URL da imagem inválida'),
  category: z
    .string()
    .min(1, 'Categoria é obrigatória'),
});

export const addToCartSchema = z.object({
  productId: z
    .string()
    .uuid('ID do produto inválido'),
  quantity: z
    .number()
    .int('Quantidade deve ser um número inteiro')
    .positive('Quantidade deve ser positiva')
    .max(99, 'Quantidade máxima é 99'),
});

export const updateQuantitySchema = z.object({
  itemId: z.string().uuid('ID do item inválido'),
  quantity: z
    .number()
    .int('Quantidade deve ser um número inteiro')
    .positive('Quantidade deve ser positiva')
    .max(99, 'Quantidade máxima é 99'),
});

export const searchSchema = z
  .object({
    query: z
      .string()
      .max(255, 'Termo de busca muito longo')
      .optional(),
    category: z
      .string()
      .max(100, 'Categoria inválida')
      .optional(),
    minPrice: z
      .number()
      .min(
        0,
        'Preço mínimo não pode ser negativo'
      )
      .optional(),
    maxPrice: z
      .number()
      .positive('Preço máximo deve ser positivo')
      .optional(),
  })
  .refine(
    (data) => {
      if (data.minPrice && data.maxPrice) {
        return data.minPrice <= data.maxPrice;
      }
      return true;
    },
    {
      message:
        'Preço mínimo deve ser menor que o preço máximo',
      path: ['maxPrice'],
    }
  );

export const orderSchema = z.object({
  userId: z
    .string()
    .uuid('ID do usuário inválido'),
  items: z
    .array(
      z.object({
        productId: z.string().uuid(),
        quantity: z.number().positive(),
        price: z.number().positive(),
      })
    )
    .min(1, 'Pedido deve ter pelo menos um item'),
  total: z
    .number()
    .positive('Total deve ser positivo'),
  whatsappMessage: z
    .string()
    .min(1, 'Mensagem do WhatsApp é obrigatória'),
});

export type SignInForm = z.infer<
  typeof signInSchema
>;
export type SignUpForm = z.infer<
  typeof signUpSchema
>;
export type ProductForm = z.infer<
  typeof productSchema
>;
export type AddToCartForm = z.infer<
  typeof addToCartSchema
>;
export type UpdateQuantityForm = z.infer<
  typeof updateQuantitySchema
>;
export type SearchForm = z.infer<
  typeof searchSchema
>;
export type OrderForm = z.infer<
  typeof orderSchema
>;

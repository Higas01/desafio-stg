export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  category: string;
  created_at?: string;
  updated_at?: string;
}

export interface CartItem {
  id: string;
  user_id: string;
  product_id: string;
  product?: Product;
  quantity: number;
  created_at?: string;
  updated_at?: string;
}

export interface Cart {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  createdAt: string;
  updatedAt: string;
}

export interface Order {
  id: string;
  user_id: string;
  items: CartItem[];
  total: number;
  whatsapp_message: string;
  created_at: string;
  updated_at: string;
}

export interface OrderStats {
  total_orders: number;
  total_spent: number;
}

export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthContextType {
  user: User | null;
  setUser: React.Dispatch<
    React.SetStateAction<User | null>
  >;
  signIn: (
    email: string,
    password: string
  ) => any;
  signUp: (
    email: string,
    password: string,
    name: string
  ) => Promise<void>;
  signOut: () => Promise<void>;
  getSession: () => Promise<void>;
}

export interface CartContextType {
  cart: Cart | null;
  loading: boolean;
  addToCart: (
    productId: string,
    quantity?: number
  ) => any;
  removeFromCart: (itemId: string) => any;
  updateQuantity: (
    itemId: string,
    quantity: number
  ) => any;
  clearCart: () => any;
  getCartTotal: () => number;
  addToCartWhenSignedIn: () => void;
}

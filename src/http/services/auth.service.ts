import {
  AppError,
  ValidationError,
} from '@/handler/errorHandler';
import { supabase } from '@/services/supabase';

export class AuthService {
  constructor() {}

  static async signIn(
    email: string,
    password: string
  ) {
    const { data, error } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      });

    if (error) {
      throw new ValidationError(error.message);
    }

    return { data, error };
  }

  static async signOut() {
    const { error } =
      await supabase.auth.signOut();

    if (error) {
      throw new AppError(error.message);
    }
  }

  static async signUp(
    email: string,
    password: string,
    name: string
  ) {
    const { data, error } =
      await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
          },
        },
      });

    if (error)
      throw new ValidationError(error.message);

    return { data };
  }

  static async getSession() {
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();

    if (error) {
      throw new Error('error');
    }
    return session?.user;
  }
}

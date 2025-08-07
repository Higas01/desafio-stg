import { supabase } from '@/utils/supabase/supabase';
import { AppError } from '@/handler/AppError';

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
      if (
        error.message.includes(
          'Invalid login credentials'
        )
      ) {
        throw new AppError(
          'Email ou senha incorretos',
          401
        );
      }

      if (
        error.message.includes(
          'Email not confirmed'
        )
      ) {
        throw new AppError(
          'Por favor, confirme seu email antes de fazer login',
          403
        );
      }

      if (
        error.message.includes(
          'Too many requests'
        )
      ) {
        throw new AppError(
          'Muitas tentativas de login. Tente novamente em alguns minutos',
          429
        );
      }

      if (
        error.message.includes('signup_disabled')
      ) {
        throw new AppError(
          'Cadastros estão temporariamente desabilitados',
          503
        );
      }

      throw new AppError(
        error.message || 'Erro ao fazer login',
        400
      );
    }

    if (!data.user) {
      throw new AppError(
        'Dados de usuário não encontrados',
        400
      );
    }

    return { data, error: null };
  }

  static async signOut() {
    const { error } =
      await supabase.auth.signOut();

    if (error) {
      throw new AppError(
        error.message || 'Erro ao fazer logout',
        400
      );
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

    if (error) {
      if (
        error.message.includes(
          'User already registered'
        )
      ) {
        throw new AppError(
          'Este email já está cadastrado. Tente fazer login',
          409
        );
      }

      if (
        error.message.includes(
          'Password should be at least'
        )
      ) {
        throw new AppError(
          'A senha deve ter pelo menos 6 caracteres',
          400
        );
      }

      if (
        error.message.includes(
          'Unable to validate email address'
        )
      ) {
        throw new AppError(
          'Email inválido. Verifique o formato do email',
          400
        );
      }

      if (
        error.message.includes('signup_disabled')
      ) {
        throw new AppError(
          'Cadastros estão temporariamente desabilitados',
          503
        );
      }

      if (error.message.includes('rate_limit')) {
        throw new AppError(
          'Muitas tentativas de cadastro. Tente novamente em alguns minutos',
          429
        );
      }

      throw new AppError(
        error.message || 'Erro ao criar conta',
        400
      );
    }

    if (!data.user) {
      throw new AppError(
        'Erro ao criar usuário',
        400
      );
    }

    return { data };
  }

  static async getSession() {
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();

    if (error) {
      throw new AppError(
        error.message ||
          'Erro ao verificar sessão',
        401
      );
    }

    return session?.user || null;
  }

  static async refreshSession() {
    const { data, error } =
      await supabase.auth.refreshSession();

    if (error) {
      throw new AppError(
        error.message || 'Erro ao renovar sessão',
        401
      );
    }

    return data.session;
  }

  static async resetPassword(email: string) {
    const { error } =
      await supabase.auth.resetPasswordForEmail(
        email,
        {
          redirectTo: `${window.location.origin}/auth/reset-password`,
        }
      );

    if (error) {
      if (
        error.message.includes('User not found')
      ) {
        throw new AppError(
          'Email não encontrado em nossa base de dados',
          404
        );
      }

      if (error.message.includes('rate_limit')) {
        throw new AppError(
          'Muitas tentativas de reset. Tente novamente em alguns minutos',
          429
        );
      }

      throw new AppError(
        error.message ||
          'Erro ao enviar email de recuperação',
        400
      );
    }
  }

  static async updatePassword(
    newPassword: string
  ) {
    const { error } =
      await supabase.auth.updateUser({
        password: newPassword,
      });

    if (error) {
      if (
        error.message.includes(
          'Password should be at least'
        )
      ) {
        throw new AppError(
          'A nova senha deve ter pelo menos 6 caracteres',
          400
        );
      }

      throw new AppError(
        error.message ||
          'Erro ao atualizar senha',
        400
      );
    }
  }

  static async updateProfile(updates: {
    name?: string;
    email?: string;
  }) {
    const { error } =
      await supabase.auth.updateUser({
        data: updates,
      });

    if (error) {
      if (
        error.message.includes(
          'Unable to validate email address'
        )
      ) {
        throw new AppError(
          'Email inválido. Verifique o formato do email',
          400
        );
      }

      throw new AppError(
        error.message ||
          'Erro ao atualizar perfil',
        400
      );
    }
  }

  static async checkEmailExists(email: string) {
    const { error } =
      await supabase.auth.signInWithPassword({
        email,
        password: 'fake-password-check',
      });

    if (
      error &&
      !error.message.includes(
        'Invalid login credentials'
      )
    ) {
      return true;
    }

    return false;
  }
}

'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import {
  X,
  Eye,
  EyeOff,
  Mail,
  Lock,
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCart } from '@/contexts/CartContext';
import { nextTick } from 'process';
import toast from 'react-hot-toast';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToRegister: () => void;
}

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z
    .string()
    .min(
      6,
      'Senha deve ter pelo menos 6 caracteres'
    ),
});

type LoginFormData = z.infer<typeof loginSchema>;

interface Response {
  data: null | {
    session: {
      access_token: string;
      refresh_token: string;
    };
    user: {
      created_at: string;
      updated_at: string;
      user_metadata: {
        email: string;
        name: string;
        sub: string;
      };
    };
  };
  error: null | {
    message: string;
  };
}

const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onSwitchToRegister,
}) => {
  const { signIn, user } = useAuth();
  const { addToCartWhenSignedIn } = useCart();
  const [showPassword, setShowPassword] =
    useState(false);

  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  if (!isOpen) return null;

  const handleLogin = async (
    data: LoginFormData
  ) => {
    const response: Response = await signIn(
      data.email,
      data.password
    );
    nextTick(() => {
      const isAdded = addToCartWhenSignedIn();
      isAdded &&
        toast.success(
          'Produto adicionado ao carrinho!'
        );
    });
    if (response.data) {
      onClose();
    }
    loginForm.reset();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Entrar
          </h2>
          <button
            onClick={onClose}
            className="btn btn-ghost btn-sm"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
          <form
            onSubmit={loginForm.handleSubmit(
              handleLogin
            )}
            className="space-y-4"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="email"
                  {...loginForm.register('email')}
                  className="input pl-10 w-full"
                  placeholder="seu@email.com"
                />
              </div>
              {loginForm.formState.errors
                .email && (
                <p className="text-red-600 text-sm mt-1">
                  {
                    loginForm.formState.errors
                      .email.message
                  }
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Senha
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type={
                    showPassword
                      ? 'text'
                      : 'password'
                  }
                  {...loginForm.register(
                    'password'
                  )}
                  className="input pl-10 pr-10 w-full"
                  placeholder="Sua senha"
                />
                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </button>
              </div>
              {loginForm.formState.errors
                .password && (
                <p className="text-red-600 text-sm mt-1">
                  {
                    loginForm.formState.errors
                      .password.message
                  }
                </p>
              )}
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-md w-full"
            >
              Entrar
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Não tem uma conta?
            </p>
            <button
              onClick={onSwitchToRegister}
              className="text-primary-600 hover:text-primary-700 font-medium text-sm mt-1"
            >
              Criar conta
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;

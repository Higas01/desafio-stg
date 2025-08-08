'use client';
import React, {
  createContext,
  useContext,
  useState,
} from 'react';
import { User, AuthContextType } from '@/types';
import toast from 'react-hot-toast';
import { useMutation } from '@tanstack/react-query';
import { AuthService } from '@/http/services/auth.service';

const AuthContext = createContext<
  AuthContextType | undefined
>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error(
      'useAuth must be used within an AuthProvider'
    );
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}
export const AuthProvider: React.FC<
  AuthProviderProps
> = ({ children }) => {
  const [user, setUser] = useState<User | null>(
    null
  );

  const signUpMutation = useMutation({
    mutationFn: ({
      email,
      password,
      name,
    }: {
      email: string;
      password: string;
      name: string;
    }) =>
      AuthService.signUp(email, password, name),
    onSuccess: ({ data }) => {
      if (data.user?.identities?.length === 0) {
        toast.error(
          'Email já cadastrado no sistema'
        );
        return;
      }
      toast.success(
        'Usuário cadastrado com sucesso! (Para facilitar, não precisa ativar a conta através do email, apenas se autenticar.).'
      );
      return data;
    },
    onError: (error) => {
      toast.error(
        error.message ||
          'Erro ao cadastrar usuário'
      );
    },
  });
  const signInMutation = useMutation({
    mutationFn: ({
      email,
      password,
    }: {
      email: string;
      password: string;
    }) => AuthService.signIn(email, password),
    onSuccess: ({ data }) => {
      toast.success(
        'Login realizado com sucesso!'
      );
      setUser({
        id: data.user.user_metadata.sub,
        email: data.user.user_metadata.email,
        name: data.user.user_metadata.name || '',
        createdAt: data.user.created_at,
        updatedAt: data.user.updated_at || '',
      });
      return data;
    },
    onError: (error) => {
      toast.error(
        error.message || 'Credenciais inválidas'
      );
    },
  });
  const getSessionMutation = useMutation({
    mutationFn: () => AuthService.getSession(),
    onSuccess: (data) => {
      return data;
    },
  });

  const signOutMutation = useMutation({
    mutationFn: () => AuthService.signOut(),
    onSuccess: () => {
      setUser(null);
      toast.success(
        'Logout realizado com sucesso!'
      );
    },
    onError: (error) => {
      toast.error(
        error.message || 'Erro ao realizar logout'
      );
    },
  });

  const signIn = async (
    email: string,
    password: string
  ) => {
    const data = await signInMutation.mutateAsync(
      {
        email,
        password,
      }
    );
    return data;
  };

  const getSession = async () => {
    const data =
      await getSessionMutation.mutateAsync();
    if (data) {
      setUser({
        id: data.user_metadata.sub,
        email: data.user_metadata.email,
        name: data.user_metadata.name || '',
        createdAt: data.created_at,
        updatedAt: data.updated_at || '',
      });
    }
  };
  const signUp = async (
    email: string,
    password: string,
    name: string
  ) => {
    await signUpMutation.mutateAsync({
      email,
      password,
      name,
    });
  };

  const signOut = async () =>
    await signOutMutation.mutateAsync();

  const loading =
    signInMutation.isPending ||
    signUpMutation.isPending ||
    getSessionMutation.isPending ||
    signOutMutation.isPending;

  const value: AuthContextType = {
    user,
    loading,
    setUser,
    signIn,
    signUp,
    signOut,
    getSession,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

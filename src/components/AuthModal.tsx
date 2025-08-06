'use client';

import { useState } from 'react';
import LoginModal from './LoginModal';
import RegisterModal from './RegisterModal';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [isLogin, setIsLogin] = useState(true);

  const handleSwitchToRegister = () => {
    setIsLogin(false);
  };

  const handleSwitchToLogin = () => {
    setIsLogin(true);
  };

  const handleClose = () => {
    setIsLogin(true); // Reset to login when closing
    onClose();
  };

  if (isLogin) {
    return (
      <LoginModal
        isOpen={isOpen}
        onClose={handleClose}
        onSwitchToRegister={
          handleSwitchToRegister
        }
      />
    );
  }

  return (
    <RegisterModal
      isOpen={isOpen}
      onClose={handleClose}
      onSwitchToLogin={handleSwitchToLogin}
    />
  );
};

export default AuthModal;

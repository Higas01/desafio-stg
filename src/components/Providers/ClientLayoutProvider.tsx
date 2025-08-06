'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import AuthModal from '@/components/AuthModal';

// export const getStaticProps = (async (context)) => {

// }

export default function ClientLayoutProvider() {
  const { user, getSession } = useAuth();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchData = async () => {
      await getSession();
    };
    fetchData();
    setLoading(false);
  }, []);

  const [showAuthModal, setShowAuthModal] =
    useState(false);

  return (
    <>
      <Header
        onAuthClick={() => setShowAuthModal(true)}
        isLoading={loading}
      />
      {showAuthModal && !user && (
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
        />
      )}
    </>
  );
}

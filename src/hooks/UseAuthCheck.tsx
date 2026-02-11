import { useEffect, useState } from 'react';

const API_BASE = import.meta.env.VITE_API_BASE_URL;

type User = {
  _id: string;
  username: string;
  email?: string;
};

type AuthState = {
  loading: boolean;
  authenticated: boolean;
  user: User | null;
};

export function useAuthCheck() {
  const [authState, setAuthState] = useState<AuthState>({
    loading: true,
    authenticated: false,
    user: null,
  });

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/auth/me`, {
          credentials: 'include',
        });

        if (res.ok) {
          const userData = await res.json();
          setAuthState({
            loading: false,
            authenticated: true,
            user: userData,
          });
        } else {
          setAuthState({
            loading: false,
            authenticated: false,
            user: null,
          });
        }
      } catch (error) {
        console.error('Auth check error:', error);
        setAuthState({
          loading: false,
          authenticated: false,
          user: null,
        });
      }
    };

    checkAuth();
  }, []);

  return authState;
}

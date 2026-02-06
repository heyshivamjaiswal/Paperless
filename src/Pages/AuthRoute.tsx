import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

type Props = {
  children: React.ReactNode;
};

export default function AuthRoute({ children }: Props) {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('http://localhost:3000/api/auth/me', {
          credentials: 'include',
        });

        if (res.ok) {
          setAuthenticated(true);
        }
      } catch {
        setAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (loading) return null;

  // 🔥 Already logged in → editor pe bhej do
  if (authenticated) {
    return <Navigate to="/page/new" replace />;
  }

  return <>{children}</>;
}

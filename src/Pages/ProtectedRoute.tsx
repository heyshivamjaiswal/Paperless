import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

type Props = {
  children: React.ReactNode;
};

export default function ProtectedRoute({ children }: Props) {
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('http://localhost:3000/api/auth/me', {
          credentials: 'include',
        });

        if (res.ok) {
          setAuthorized(true);
        }
      } catch {
        setAuthorized(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (loading) return null; // or loader

  if (!authorized) {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
}

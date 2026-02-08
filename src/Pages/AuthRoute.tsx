import { Navigate } from 'react-router-dom';
import { useAuthCheck } from '../hooks/UseAuthCheck';

type Props = {
  children: React.ReactNode;
};

export default function AuthRoute({ children }: Props) {
  const { loading, authenticated } = useAuthCheck();

  // Show loading state
  if (loading) {
    return (
      <div className="w-screen h-screen flex items-center justify-center bg-[#0f0f0f]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-2 border-white/20 border-t-white/80 rounded-full animate-spin" />
          <div className="text-sm text-white/60">Loading...</div>
        </div>
      </div>
    );
  }

  // Redirect to app if already authenticated
  if (authenticated) {
    return <Navigate to="/page/new" replace />;
  }

  return <>{children}</>;
}

import { Navigate } from 'react-router-dom';
import { useAuthCheck } from '../hooks/UseAuthCheck';
import { useEffect, useState } from 'react';

type Props = {
  children: React.ReactNode;
};

export default function AuthRoute({ children }: Props) {
  const { loading, authenticated } = useAuthCheck();
  const [showSlowMessage, setShowSlowMessage] = useState(false);

  // Show "taking longer" message after 3 seconds
  useEffect(() => {
    if (loading) {
      const timer = setTimeout(() => {
        setShowSlowMessage(true);
      }, 3000);

      return () => clearTimeout(timer);
    } else {
      setShowSlowMessage(false);
    }
  }, [loading]);

  // Show loading state
  if (loading) {
    return (
      <div className="w-screen h-screen flex items-center justify-center bg-[#0f0f0f]">
        <div className="flex flex-col items-center gap-4 max-w-md px-6">
          <div className="w-10 h-10 border-2 border-white/20 border-t-white/80 rounded-full animate-spin" />

          {!showSlowMessage ? (
            <div className="text-center">
              <div className="text-sm text-white/60">
                Connecting to server...
              </div>
            </div>
          ) : (
            <div className="text-center space-y-2 animate-fade-in">
              <div className="text-sm text-white/60">
                This may take a moment
              </div>
              <div className="text-xs text-white/40 leading-relaxed">
                The server might be waking up from sleep.
                <br />
                Thanks for your patience!
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Redirect to HOME (not /page/new) if already authenticated
  if (authenticated) {
    return <Navigate to="/home" replace />;
  }

  return <>{children}</>;
}

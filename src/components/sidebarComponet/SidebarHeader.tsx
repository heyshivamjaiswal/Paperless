import { GoSidebarCollapse, GoSidebarExpand } from 'react-icons/go';
import { useOpen } from '../../store/sidebarCollapse';
import Tooltip from '../helperComponent/Tooltip';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthCheck } from '../../hooks/UseAuthCheck';

function SidebarHeader() {
  const toggleBtn = useOpen((s) => s.toggle);
  const open = useOpen((s) => s.open);
  const navigate = useNavigate();

  // Get real user data from auth hook
  const { authenticated, user } = useAuthCheck();

  const [menuOpen, setMenuOpen] = useState(false);

  // Get user's first letter
  const displaySource = user?.username || user?.email || '';

  const firstLetter = displaySource.charAt(0)?.toUpperCase() || 'U';

  const displayName = user?.username || user?.email?.split('@')[0] || 'User';

  // Logout handler
  const handleLogout = async () => {
    try {
      await fetch('http://localhost:3000/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });

      navigate('/auth', { replace: true });
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div className="flex-shrink-0">
      {/* Top Row */}
      <div
        className={`p-3 flex items-center transition-all ${
          open ? 'justify-between' : 'justify-center'
        }`}
      >
        {/* Sidebar Toggle */}
        <div className="relative group">
          <button
            onClick={toggleBtn}
            className="text-white text-xl p-2 rounded-lg hover:bg-white/8 
                     transition-all active:scale-95"
            aria-label={open ? 'Close sidebar' : 'Open sidebar'}
          >
            {open ? <GoSidebarCollapse /> : <GoSidebarExpand />}
          </button>

          <Tooltip text={open ? 'Close sidebar' : 'Open sidebar'} />
        </div>

        {/* User Avatar (only when open) */}
        {open && (
          <div className="relative">
            <button
              onClick={() => setMenuOpen((p) => !p)}
              className="w-9 h-9 rounded-full bg-neutral-600
                       text-white flex items-center justify-center font-semibold text-sm
                       hover:shadow-lg hover:scale-105 transition-all active:scale-95
                       border border-white/20"
              aria-label="User menu"
            >
              {firstLetter}
            </button>

            {/* Dropdown Menu */}
            {menuOpen && (
              <>
                {/* Backdrop to close menu */}
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setMenuOpen(false)}
                />

                {/* Menu */}
                <div
                  className="absolute right-0 mt-2 w-48 rounded-xl bg-neutral-800 
                             border border-white/10 shadow-2xl z-50 overflow-hidden
                             animate-in fade-in slide-in-from-top-2 duration-200"
                >
                  {/* User Info */}
                  <div className="px-4 py-3 border-b border-white/10">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 
                                    flex items-center justify-center text-white font-semibold text-xs"
                      >
                        {firstLetter}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">
                          {displayName}
                        </p>
                        {user?.email && (
                          <p className="text-xs text-neutral-400 truncate">
                            {user.email}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="py-1">
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2.5 text-sm text-red-400 
                               hover:bg-red-400/10 transition-colors flex items-center gap-2"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                        />
                      </svg>
                      Log out
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default SidebarHeader;

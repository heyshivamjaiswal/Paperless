import { motion, AnimatePresence } from 'framer-motion';
import { GoSidebarCollapse, GoSidebarExpand } from 'react-icons/go';
import { useOpen } from '../../store/sidebarCollapse';
import Tooltip from '../helperComponent/Tooltip';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthCheck } from '../../hooks/UseAuthCheck';

interface SidebarHeaderProps {
  onMenuToggle?: (isOpen: boolean) => void;
}

function SidebarHeader({ onMenuToggle }: SidebarHeaderProps) {
  const toggleBtn = useOpen((s) => s.toggle);
  const open = useOpen((s) => s.open);
  const navigate = useNavigate();

  const { user } = useAuthCheck();
  const [menuOpen, setMenuOpen] = useState(false);

  const displaySource = user?.username || user?.email || '';
  const firstLetter = displaySource.charAt(0)?.toUpperCase() || 'U';
  const displayName = user?.username || user?.email?.split('@')[0] || 'User';

  // Notify parent when menu opens/closes
  useEffect(() => {
    onMenuToggle?.(menuOpen);
  }, [menuOpen, onMenuToggle]);

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
    <div className="flex-shrink-0 px-3 py-3 relative z-50">
      <motion.div
        className={`flex items-center transition-all ${
          open ? 'justify-between' : 'justify-center'
        }`}
        layout
      >
        {/* Sidebar Toggle */}
        <div className="relative group">
          <motion.button
            onClick={toggleBtn}
            className="text-white/60 text-xl p-2 rounded-lg hover:bg-white/[0.08] 
                     transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label={open ? 'Close sidebar' : 'Open sidebar'}
          >
            <motion.div
              animate={{ rotate: open ? 0 : 180 }}
              transition={{ duration: 0.2, ease: 'easeInOut' }}
            >
              {open ? <GoSidebarCollapse /> : <GoSidebarExpand />}
            </motion.div>
          </motion.button>

          <Tooltip text={open ? 'Close sidebar' : 'Open sidebar'} />
        </div>

        {/* User Avatar */}
        <AnimatePresence>
          {open && (
            <motion.div
              className="relative"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
            >
              <motion.button
                onClick={() => setMenuOpen((p) => !p)}
                className="w-9 h-9 rounded-full bg-white/10
                       text-white flex items-center justify-center font-semibold text-sm
                       hover:bg-white/[0.15] transition-colors relative z-50"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label="User menu"
              >
                {firstLetter}
              </motion.button>

              {/* Dropdown Menu */}
              <AnimatePresence>
                {menuOpen && (
                  <>
                    {/* Backdrop - covers entire screen */}
                    <motion.div
                      className="fixed inset-0 z-[100]"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onClick={() => setMenuOpen(false)}
                    />

                    {/* Menu - highest z-index */}
                    <motion.div
                      className="absolute right-0 mt-2 w-56 rounded-2xl bg-[#2c2c2e] 
                               border border-white/[0.08] shadow-2xl z-[101] overflow-hidden"
                      initial={{ opacity: 0, y: -8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.96 }}
                      transition={{ duration: 0.15, ease: 'easeOut' }}
                      style={{ position: 'absolute' }}
                    >
                      {/* User Info */}
                      <div className="px-4 py-3 border-b border-white/[0.08]">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-10 h-10 rounded-full bg-white/10
                                        flex items-center justify-center text-white font-semibold text-sm"
                          >
                            {firstLetter}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-white truncate">
                              {displayName}
                            </p>
                            {user?.email && (
                              <p className="text-xs text-white/40 truncate">
                                {user.email}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="p-1.5">
                        <motion.button
                          onClick={handleLogout}
                          className="w-full text-left px-3 py-2 text-sm text-red-400 
                                   rounded-lg hover:bg-white/[0.08] transition-colors 
                                   flex items-center gap-2"
                          whileHover={{ x: 2 }}
                          whileTap={{ scale: 0.98 }}
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
                        </motion.button>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

export default SidebarHeader;

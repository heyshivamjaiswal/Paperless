import { motion } from 'framer-motion';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { useOpen } from '../store/sidebarCollapse';

export default function AppShell() {
  const open = useOpen((s) => s.open);

  return (
    <div className="h-screen w-screen flex bg-black overflow-hidden">
      {/* Sidebar */}
      <motion.div
        className="h-full flex-shrink-0 relative z-10"
        initial={false}
        animate={{
          width: open ? 256 : 56,
        }}
        transition={{
          type: 'spring',
          stiffness: 400,
          damping: 40,
        }}
      >
        {/* Sidebar border */}
        <div className="absolute right-0 top-0 bottom-0 w-px bg-white/[0.08]" />

        <Sidebar />
      </motion.div>

      {/* Main content */}
      <div className="flex-1 overflow-hidden relative bg-black">
        <Outlet />
      </div>
    </div>
  );
}

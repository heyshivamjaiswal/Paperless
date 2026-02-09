import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { useOpen } from '../store/sidebarCollapse';
import SidebarDocuments from './sidebarComponet/SidebarDocuments';
import SidebarFooter from './sidebarComponet/SidebarFooter';
import SidebarHeader from './sidebarComponet/SidebarHeader';

function Sidebar() {
  const open = useOpen((s) => s.open);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <motion.aside
      className="h-full w-full text-white relative bg-[#1c1c1e]"
      initial={false}
    >
      <nav className="h-full flex flex-col relative">
        <SidebarHeader onMenuToggle={setIsMenuOpen} />

        <AnimatePresence>
          {open && (
            <motion.hr
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              exit={{ scaleX: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="border-white/[0.08] origin-left mx-3"
            />
          )}
        </AnimatePresence>

        <SidebarDocuments isMenuOpen={isMenuOpen} />
        <SidebarFooter />
      </nav>
    </motion.aside>
  );
}

export default Sidebar;

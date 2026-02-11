import { motion, AnimatePresence } from 'framer-motion';
import { TiHome } from 'react-icons/ti';
import { GiBrain } from 'react-icons/gi';
import { SlCalender } from 'react-icons/sl';
import { useNavigate, useLocation } from 'react-router-dom';
import { useOpen } from '../../store/sidebarCollapse';
import Tooltip from '../helperComponent/Tooltip';

function SidebarFooter() {
  const open = useOpen((s) => s.open);
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <motion.div
      className={`flex-shrink-0 p-3 flex flex-col gap-1 transition-all ${
        open ? 'items-stretch border-t border-white/[0.08]' : 'items-center'
      }`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <Icon
        icon={<TiHome className="text-xl" />}
        label="Home"
        open={open}
        onClick={() => navigate('/home')}
        isActive={isActive('/home')}
      />
      <Icon
        icon={<GiBrain className="text-xl" />}
        label="AI"
        open={open}
        onClick={() => navigate('/ai-chat')}
        isActive={isActive('/ai-chat')}
      />
      <Icon
        icon={<SlCalender className="text-xl" />}
        label="Schedules"
        open={open}
        onClick={() => navigate('/schedule')}
        isActive={isActive('/schedule')}
      />
    </motion.div>
  );
}

function Icon({
  icon,
  label,
  open,
  onClick,
  isActive,
}: {
  icon: React.ReactNode;
  label: string;
  open: boolean;
  onClick: () => void;
  isActive: boolean;
}) {
  return (
    <motion.div
      onClick={onClick}
      className={`relative group flex items-center gap-3 cursor-pointer px-2 py-2 rounded-lg 
                 transition-all ${
                   isActive
                     ? 'bg-white/[0.12] text-white'
                     : 'text-white/50 hover:text-white hover:bg-white/[0.08]'
                 }`}
      whileHover={{ x: 2 }}
      whileTap={{ scale: 0.98 }}
    >
      <span className="relative z-10">{icon}</span>

      <AnimatePresence>
        {open && (
          <motion.span
            className="text-[13px] font-medium relative z-10"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.15 }}
          >
            {label}
          </motion.span>
        )}
      </AnimatePresence>

      {!open && <Tooltip text={label} />}
    </motion.div>
  );
}

export default SidebarFooter;

import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { useOpen } from '../store/sidebarCollapse';

export default function AppShell() {
  const open = useOpen((s) => s.open);

  return (
    <div className="h-screen w-screen flex bg-[#0f0f0f] overflow-hidden">
      {/* Sidebar - Fixed overflow to prevent scrollbar flash */}
      <div
        className={`
          h-full transition-all duration-300 ease-in-out flex-shrink-0
          ${open ? 'w-64 bg-neutral-900 border-r border-white/10' : 'w-14'}
          overflow-hidden
        `}
      >
        <Sidebar />
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-hidden">
        <Outlet />
      </div>
    </div>
  );
}

// import Sidebar from '../components/Sidebar';
// import { useOpen } from '../store/sidebarCollapse';
// import BlockEditor from './BlockEditor';
// import { motion } from 'framer-motion';

// export default function AppShell() {
//   const open = useOpen((state) => state.open);

//   return (
//     <div className="h-screen w-screen relative overflow-hidden bg-[#0f0f0f]">
//       {/* Editor fills whole screen */}
//       <div className="absolute inset-0">
//         <BlockEditor />
//       </div>

//       {/* Sidebar overlay */}
//       <motion.div
//         animate={{
//           width: open ? 256 : 56,
//           backgroundColor: open ? 'rgb(23,23,23)' : 'rgba(0,0,0,0)',
//           boxShadow: open
//             ? '0 25px 50px -12px rgba(0,0,0,0.8)'
//             : '0 0 0 0 rgba(0,0,0,0)',
//         }}
//         transition={{
//           type: 'spring',
//           stiffness: 260,
//           damping: 28,
//         }}
//         className="absolute top-0 left-0 h-full z-50 border-r border-white/10 overflow-hidden"
//       >
//         <Sidebar />
//       </motion.div>
//     </div>
//   );
// }

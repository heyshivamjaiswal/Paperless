import { GoSidebarCollapse, GoSidebarExpand } from 'react-icons/go';
import { CiSearch } from 'react-icons/ci';
import { useOpen } from '../../store/sidebarCollapse';
import Tooltip from '../helperComponent/Tooltip';

function SidebarHeader() {
  const toggleBtn = useOpen((s) => s.toggle);
  const open = useOpen((s) => s.open);

  return (
    <>
      {/* Toggle */}
      <div
        className={`p-3 flex items-center transition-all ${
          open ? 'justify-end' : 'justify-center'
        }`}
      >
        <div className="relative group">
          <button
            onClick={toggleBtn}
            className="text-white text-xl p-2 rounded hover:bg-white/10 transition-all"
          >
            {open ? <GoSidebarCollapse /> : <GoSidebarExpand />}
          </button>

          {!open && <Tooltip text="Open sidebar" />}
          {open && <Tooltip text="Close sidebar" />}
        </div>
      </div>

      {/* Search */}
      {open && (
        <div className="px-3 pb-4">
          <div className="relative">
            <CiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              placeholder="Search documents..."
              className="w-full h-10 rounded-xl bg-white text-neutral-700 outline-none pl-10 pr-3 font-semibold"
            />
          </div>
        </div>
      )}
    </>
  );
}

export default SidebarHeader;

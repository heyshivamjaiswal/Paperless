import { TiHome } from 'react-icons/ti';
import { GiBrain } from 'react-icons/gi';
import { SlCalender } from 'react-icons/sl';
import { useOpen } from '../../store/sidebarCollapse';
import Tooltip from '../helperComponent/Tooltip';

function SidebarFooter() {
  const open = useOpen((s) => s.open);

  return (
    <div
      className={`p-2 flex flex-col gap-4 transition-all ${
        open
          ? 'items-start border-t border-neutral-800'
          : 'items-center border-none'
      }`}
    >
      <Icon icon={<TiHome className="text-xl" />} label="Home" open={open} />
      <Icon icon={<GiBrain className="text-xl" />} label="AI" open={open} />
      <Icon
        icon={<SlCalender className="text-xl" />}
        label="Schedules"
        open={open}
      />
    </div>
  );
}

function Icon({
  icon,
  label,
  open,
}: {
  icon: React.ReactNode;
  label: string;
  open: boolean;
}) {
  return (
    <div className="relative group flex items-center gap-3 text-neutral-400 hover:text-white cursor-pointer">
      {icon}
      {open && <span className="text-xs">{label}</span>}
      {!open && <Tooltip text={label} />}
    </div>
  );
}

export default SidebarFooter;

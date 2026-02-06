import { useOpen } from '../store/sidebarCollapse';
import SidebarDocuments from './sidebarComponet/SidebarDocuments';
import SidebarFooter from './sidebarComponet/SidebarFooter';
import SidebarHeader from './sidebarComponet/SidebarHeader';

function Sidebar() {
  const open = useOpen((s) => s.open);

  return (
    <aside className="h-full w-full text-white">
      <nav className="h-full flex flex-col">
        <SidebarHeader />
        {open && <hr className="border-neutral-800" />}
        <SidebarDocuments />
        <SidebarFooter />
      </nav>
    </aside>
  );
}

export default Sidebar;

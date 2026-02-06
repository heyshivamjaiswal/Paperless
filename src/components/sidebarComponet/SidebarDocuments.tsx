import { useState } from 'react';
import { HiDocumentAdd } from 'react-icons/hi';
import { IoIosRemoveCircle } from 'react-icons/io';
import { useNavigate, useParams } from 'react-router-dom';

import { usePagesStore } from '../../store/pageStore';
import { useOpen } from '../../store/sidebarCollapse';

function SidebarDocuments() {
  const open = useOpen((s) => s.open);
  const navigate = useNavigate();
  const { pageId } = useParams<{ pageId: string }>();

  const pages = usePagesStore((s) => s.pages);
  const createPage = usePagesStore((s) => s.createPage);
  const removePage = usePagesStore((s) => s.removePage);
  const updatePageTitle = usePagesStore((s) => s.updatePageTitle);
  const resetPage = usePagesStore((s) => s.resetPage);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [tempTitle, setTempTitle] = useState('');

  if (!open) return <div className="flex-1" />;

  return (
    <div className="sidebar-scroll flex-1 flex flex-col overflow-y-auto">
      <div className=" flex justify-between pt-4 pr-5 items-center">
        <p className="text-sm text-neutral-400 pl-6">DOCUMENTS</p>

        <HiDocumentAdd
          className="text-xl cursor-pointer text-neutral-400 hover:text-white"
          onClick={() => {
            const id = createPage();
            navigate(`/page/${id}`);
          }}
        />
      </div>
      <div className="mt-3 flex flex-col gap-1 px-2">
        {pages.map((page, index) => {
          const isActive = page.id === pageId;
          const isEditing = editingId === page.id;

          return (
            <div
              key={page.id}
              onClick={() => {
                if (!isEditing) navigate(`/page/${page.id}`);
              }}
              className={`
                group relative flex items-center px-3 py-2 rounded-md cursor-pointer
                transition-colors
                ${
                  isActive
                    ? 'bg-white/10 text-white'
                    : 'text-neutral-400 hover:bg-white/5 hover:text-white'
                }
              `}
            >
              {isEditing ? (
                <input
                  autoFocus
                  value={tempTitle}
                  onChange={(e) => setTempTitle(e.target.value)}
                  onBlur={() => {
                    updatePageTitle(
                      page.id,
                      tempTitle.trim() || 'Untitled',
                      true
                    );
                    setEditingId(null);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      updatePageTitle(
                        page.id,
                        tempTitle.trim() || 'Untitled',
                        true
                      );
                      setEditingId(null);
                    }
                    if (e.key === 'Escape') {
                      setEditingId(null);
                    }
                  }}
                  className="bg-transparent outline-none text-sm flex-1"
                />
              ) : (
                <span
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    setEditingId(page.id);
                    setTempTitle(page.title || '');
                  }}
                  className="truncate text-sm flex-1"
                >
                  {page.title || 'Untitled'}
                </span>
              )}

              <IoIosRemoveCircle
                onClick={(e) => {
                  e.stopPropagation();

                  const isOnlyPage = pages.length === 1;
                  const isActivePage = page.id === pageId;
                  if (isOnlyPage) {
                    resetPage(page.id);
                    return;
                  }
                  if (isActivePage) {
                    const nextPage = pages[index + 1] || pages[index - 1];
                    navigate(`/page/${nextPage.id}`, { replace: true });
                  }
                  removePage(page.id);
                }}
                className="opacity-0 group-hover:opacity-100 text-neutral-400 hover:text-red-400transition-opacity cursor-pointer"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default SidebarDocuments;

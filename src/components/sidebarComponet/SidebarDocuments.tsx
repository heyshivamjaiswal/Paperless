// import { useState } from 'react';
// import { HiDocumentAdd } from 'react-icons/hi';
// import { IoIosRemoveCircle } from 'react-icons/io';
// import { useNavigate, useParams } from 'react-router-dom';

// import { usePagesStore } from '../../store/pageStore';
// import { useOpen } from '../../store/sidebarCollapse';

// function SidebarDocuments() {
//   const open = useOpen((s) => s.open);
//   const navigate = useNavigate();
//   const { pageId } = useParams<{ pageId: string }>();

//   const pages = usePagesStore((s) => s.pages);
//   const createPage = usePagesStore((s) => s.createPage);
//   const removePage = usePagesStore((s) => s.removePage);
//   const updatePageTitle = usePagesStore((s) => s.updatePageTitle);
//   const resetPage = usePagesStore((s) => s.resetPage);

//   const [editingId, setEditingId] = useState<string | null>(null);
//   const [tempTitle, setTempTitle] = useState('');

//   if (!open) return <div className="flex-1" />;

//   return (
//     <div className="sidebar-scroll flex-1 flex flex-col overflow-y-auto">
//       <div className=" flex justify-between pt-4 pr-5 items-center">
//         <p className="text-sm text-neutral-400 pl-6">DOCUMENTS</p>

//         <HiDocumentAdd
//           className="text-xl cursor-pointer text-neutral-400 hover:text-white"
//           onClick={() => {
//             const id = createPage();
//             navigate(`/page/${id}`);
//           }}
//         />
//       </div>
//       <div className="mt-3 flex flex-col gap-1 px-2">
//         {pages.map((page, index) => {
//           const isActive = page.id === pageId;
//           const isEditing = editingId === page.id;

//           return (
//             <div
//               key={page.id}
//               onClick={() => {
//                 if (!isEditing) navigate(`/page/${page.id}`);
//               }}
//               className={`
//                 group relative flex items-center px-3 py-2 rounded-md cursor-pointer
//                 transition-colors
//                 ${
//                   isActive
//                     ? 'bg-white/10 text-white'
//                     : 'text-neutral-400 hover:bg-white/5 hover:text-white'
//                 }
//               `}
//             >
//               {isEditing ? (
//                 <input
//                   autoFocus
//                   value={tempTitle}
//                   onChange={(e) => setTempTitle(e.target.value)}
//                   onBlur={() => {
//                     updatePageTitle(
//                       page.id,
//                       tempTitle.trim() || 'Untitled',
//                       true
//                     );
//                     setEditingId(null);
//                   }}
//                   onKeyDown={(e) => {
//                     if (e.key === 'Enter') {
//                       updatePageTitle(
//                         page.id,
//                         tempTitle.trim() || 'Untitled',
//                         true
//                       );
//                       setEditingId(null);
//                     }
//                     if (e.key === 'Escape') {
//                       setEditingId(null);
//                     }
//                   }}
//                   className="bg-transparent outline-none text-sm flex-1"
//                 />
//               ) : (
//                 <span
//                   onDoubleClick={(e) => {
//                     e.stopPropagation();
//                     setEditingId(page.id);
//                     setTempTitle(page.title || '');
//                   }}
//                   className="truncate text-sm flex-1"
//                 >
//                   {page.title || 'Untitled'}
//                 </span>
//               )}

//               <IoIosRemoveCircle
//                 onClick={(e) => {
//                   e.stopPropagation();

//                   const isOnlyPage = pages.length === 1;
//                   const isActivePage = page.id === pageId;
//                   if (isOnlyPage) {
//                     resetPage(page.id);
//                     return;
//                   }
//                   if (isActivePage) {
//                     const nextPage = pages[index + 1] || pages[index - 1];
//                     navigate(`/page/${nextPage.id}`, { replace: true });
//                   }
//                   removePage(page.id);
//                 }}
//                 className="opacity-0 group-hover:opacity-100 text-neutral-400 hover:text-red-400transition-opacity cursor-pointer"
//               />
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// }

// export default SidebarDocuments;

import { useEffect, useState, useMemo } from 'react';
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
  const setPages = usePagesStore((s) => s.setPages);
  const addPage = usePagesStore((s) => s.addPage);
  const removePage = usePagesStore((s) => s.removePage);

  const [searchQuery, setSearchQuery] = useState('');

  // Fetch documents
  useEffect(() => {
    const fetchDocs = async () => {
      try {
        const res = await fetch('http://localhost:3000/api/docs', {
          credentials: 'include',
        });

        if (!res.ok) return;

        const docs = await res.json();
        setPages(docs);
      } catch (error) {
        console.error('Error fetching documents:', error);
      }
    };

    fetchDocs();
  }, [setPages]);

  // Filter documents based on search
  const filteredPages = useMemo(() => {
    if (!searchQuery.trim()) return pages;

    const query = searchQuery.toLowerCase();
    return pages.filter((page) =>
      (page.title || 'Untitled').toLowerCase().includes(query)
    );
  }, [pages, searchQuery]);

  const createDoc = async () => {
    try {
      const res = await fetch('http://localhost:3000/api/docs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          title: 'Untitled',
          content: [
            {
              type: 'heading',
              props: { level: 1 },
              content: [{ type: 'text', text: 'Untitled' }],
            },
            { type: 'paragraph', content: [] },
          ],
        }),
      });

      if (!res.ok) return;

      const doc = await res.json();
      addPage(doc);
      navigate(`/page/${doc._id}`);
    } catch (error) {
      console.error('Error creating document:', error);
    }
  };

  const deleteDoc = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();

    try {
      const res = await fetch(`http://localhost:3000/api/docs/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!res.ok) return;

      removePage(id);

      if (pageId === id) {
        const remainingPages = pages.filter((p) => p._id !== id);
        if (remainingPages.length > 0) {
          navigate(`/page/${remainingPages[0]._id}`, { replace: true });
        } else {
          navigate('/page/new', { replace: true });
        }
      }
    } catch (error) {
      console.error('Error deleting document:', error);
    }
  };

  if (!open) return <div className="flex-1" />;

  return (
    <div className="flex-1 flex flex-col min-h-0">
      {/* Header */}
      <div className="flex-shrink-0 flex justify-between items-center px-4 pt-3 pb-2">
        <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
          Documents
        </p>
        <button
          onClick={createDoc}
          className="p-1.5 rounded-md text-neutral-400 hover:text-white hover:bg-white/5 transition-all"
          title="Create new document"
        >
          <HiDocumentAdd className="text-lg" />
        </button>
      </div>

      {/* Search Input */}
      <div className="flex-shrink-0 px-3 pb-3">
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-3 py-1.5 text-sm rounded-lg bg-white/5 text-white 
                   placeholder-neutral-500 border border-white/5
                   focus:outline-none focus:border-white/10 focus:bg-white/8
                   transition-all"
        />
      </div>

      {/* Documents List */}
      <div className="flex-1 overflow-y-auto sidebar-scroll px-2">
        {filteredPages.length === 0 && !searchQuery && (
          <div className="text-neutral-500 text-sm px-3 py-4 text-center">
            No documents yet.
            <br />
            Click + to create one.
          </div>
        )}

        {filteredPages.length === 0 && searchQuery && (
          <div className="text-neutral-500 text-sm px-3 py-4 text-center">
            No documents found for "{searchQuery}"
          </div>
        )}

        <div className="space-y-0.5 pb-2">
          {filteredPages.map((page) => {
            const isActive = page._id === pageId;

            return (
              <div
                key={page._id}
                onClick={() => navigate(`/page/${page._id}`)}
                className={`group flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer
                  transition-all duration-150
                  ${
                    isActive
                      ? 'bg-white/10 text-white shadow-sm'
                      : 'text-neutral-400 hover:bg-white/5 hover:text-white'
                  }`}
              >
                <span className="flex-1 truncate text-sm font-medium">
                  {page.title || 'Untitled'}
                </span>

                <button
                  onClick={(e) => deleteDoc(page._id, e)}
                  className="opacity-0 group-hover:opacity-100 p-1 rounded
                           text-neutral-400 hover:text-red-400 hover:bg-red-400/10
                           transition-all"
                  title="Delete document"
                >
                  <IoIosRemoveCircle className="text-base" />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default SidebarDocuments;

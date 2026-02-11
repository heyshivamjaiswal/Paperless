import { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiDocumentAdd } from 'react-icons/hi';
import { IoIosRemoveCircle } from 'react-icons/io';
import { useNavigate, useParams } from 'react-router-dom';
import { usePagesStore } from '../../store/pageStore';
import { useOpen } from '../../store/sidebarCollapse';

const API_BASE = import.meta.env.VITE_API_BASE_URL;

// Add a prop to track if menu is open
function SidebarDocuments({ isMenuOpen }: { isMenuOpen?: boolean }) {
  const open = useOpen((s) => s.open);
  const navigate = useNavigate();
  const { pageId } = useParams<{ pageId: string }>();

  const pages = usePagesStore((s) => s.pages);
  const setPages = usePagesStore((s) => s.setPages);
  const addPage = usePagesStore((s) => s.addPage);
  const removePage = usePagesStore((s) => s.removePage);

  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchDocs = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/docs`, {
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

  const filteredPages = useMemo(() => {
    if (!searchQuery.trim()) return pages;
    const query = searchQuery.toLowerCase();
    return pages.filter((page) =>
      (page.title || 'Untitled').toLowerCase().includes(query)
    );
  }, [pages, searchQuery]);

  const createDoc = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/docs`, {
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
      const res = await fetch(`${API_BASE}/api/docs/${id}`, {
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
    <motion.div
      className="flex-1 flex flex-col min-h-0 relative z-10"
      initial={{ opacity: 0 }}
      animate={{
        opacity: 1,
        // Smooth push down when menu is open
        marginTop: isMenuOpen ? 100 : 0,
      }}
      transition={{
        opacity: { duration: 0.2 },
        marginTop: {
          duration: 0.35,
          ease: [0.4, 0.0, 0.2, 1], // Smooth easing curve
        },
      }}
    >
      {/* Header */}
      <motion.div
        className="flex-shrink-0 flex justify-between items-center px-3 pt-2 pb-3"
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.05 }}
      >
        <p className="text-[11px] font-semibold text-white/50 uppercase tracking-wide">
          Documents
        </p>
        <motion.button
          onClick={createDoc}
          className="p-1.5 rounded-lg text-white/50 hover:text-white hover:bg-white/[0.08] 
                   transition-all"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          title="Create new document"
        >
          <HiDocumentAdd className="text-lg" />
        </motion.button>
      </motion.div>

      {/* Search Input */}
      <motion.div
        className="flex-shrink-0 px-3 pb-3"
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <div className="relative">
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-3 py-2 text-sm rounded-lg bg-white/[0.08] text-white 
                     placeholder-white/30 border border-transparent
                     focus:outline-none focus:border-white/20 focus:bg-white/[0.12]
                     transition-all"
          />
          <svg
            className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </motion.div>

      {/* Documents List */}
      <div className="flex-1 overflow-y-auto sidebar-scroll px-2">
        <AnimatePresence mode="popLayout">
          {filteredPages.length === 0 && !searchQuery && (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-white/30 text-xs px-3 py-8 text-center"
            >
              No documents yet.
              <br />
              <span className="text-white/40">Click + to create one.</span>
            </motion.div>
          )}

          {filteredPages.length === 0 && searchQuery && (
            <motion.div
              key="no-results"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-white/30 text-xs px-3 py-8 text-center"
            >
              No results for "{searchQuery}"
            </motion.div>
          )}

          <motion.div className="space-y-0.5 pb-2" layout>
            {filteredPages.map((page, index) => {
              const isActive = page._id === pageId;

              return (
                <motion.div
                  key={page._id}
                  onClick={() => navigate(`/page/${page._id}`)}
                  className={`group flex items-center gap-2.5 px-3 py-2 rounded-lg cursor-pointer
                    relative transition-colors
                    ${
                      isActive
                        ? 'bg-white/[0.12] text-white'
                        : 'text-white/60 hover:text-white hover:bg-white/[0.06]'
                    }`}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ delay: index * 0.02 }}
                  layout
                >
                  {/* Document icon */}
                  <svg
                    className="w-4 h-4 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>

                  <span className="flex-1 truncate text-[13px] font-medium">
                    {page.title || 'Untitled'}
                  </span>

                  {/* Delete button */}
                  <motion.button
                    onClick={(e) => deleteDoc(page._id, e)}
                    className="opacity-0 group-hover:opacity-100 p-1 rounded
                             text-white/40 hover:text-red-400 hover:bg-white/[0.08]
                             transition-all"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    title="Delete document"
                  >
                    <IoIosRemoveCircle className="text-base" />
                  </motion.button>
                </motion.div>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

export default SidebarDocuments;

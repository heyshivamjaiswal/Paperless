import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { usePagesStore } from '../store/pageStore';
import { HiDocumentAdd, HiOutlineDocument } from 'react-icons/hi';

const API_BASE = import.meta.env.VITE_API_BASE_URL;

function HomePage() {
  const navigate = useNavigate();
  const pages = usePagesStore((s) => s.pages);
  const setPages = usePagesStore((s) => s.setPages);
  const addPage = usePagesStore((s) => s.addPage);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDocs = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/docs`, {
          credentials: 'include',
        });
        if (!res.ok) {
          setIsLoading(false);
          return;
        }
        const docs = await res.json();
        setPages(docs);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching documents:', error);
        setIsLoading(false);
      }
    };
    fetchDocs();
  }, [setPages]);

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

  const getDocumentPreview = (content: any[]) => {
    // Get first paragraph or content after the title
    const paragraphs = content.filter(
      (block) => block.type === 'paragraph' && block.content?.length > 0
    );

    if (paragraphs.length > 0) {
      const text = paragraphs[0].content
        .map((c: any) => c.text)
        .join('')
        .trim();
      return text.substring(0, 150) + (text.length > 150 ? '...' : '');
    }

    return 'No content yet';
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Recently';

    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;

    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
    });
  };

  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-black">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-white/20 border-t-white/60 rounded-full animate-spin" />
          <div className="text-sm text-white/40">Loading documents...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-black overflow-y-auto">
      <div className="max-w-7xl mx-auto px-8 py-12">
        {/* Header */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h1 className="text-4xl font-bold text-white mb-2">Your Documents</h1>
          <p className="text-white/50 text-lg">
            {pages.length} {pages.length === 1 ? 'document' : 'documents'}
          </p>
        </motion.div>

        {/* Create New Button */}
        <motion.button
          onClick={createDoc}
          className="mb-8 flex items-center gap-3 px-6 py-3 rounded-xl
                   bg-white/[0.08] hover:bg-white/[0.12] 
                   border border-white/[0.08] hover:border-white/20
                   text-white transition-all group"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <HiDocumentAdd className="text-2xl group-hover:rotate-12 transition-transform" />
          <span className="font-medium">Create New Document</span>
        </motion.button>

        {/* Documents Grid */}
        {pages.length === 0 ? (
          <motion.div
            className="text-center py-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <HiOutlineDocument className="text-6xl text-white/20 mx-auto mb-4" />
            <p className="text-white/40 text-lg">No documents yet</p>
            <p className="text-white/30 text-sm mt-2">
              Create your first document to get started
            </p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pages.map((doc, index) => (
              <motion.div
                key={doc._id}
                onClick={() => navigate(`/page/${doc._id}`)}
                className="group cursor-pointer"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05, duration: 0.3 }}
                whileHover={{ y: -4 }}
              >
                <div
                  className="h-full p-6 rounded-2xl bg-white/[0.04] 
                              border border-white/[0.08] hover:border-white/20
                              hover:bg-white/[0.06] transition-all"
                >
                  {/* Icon and Date */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-2 rounded-lg bg-white/[0.08] group-hover:bg-white/[0.12] transition-colors">
                      <HiOutlineDocument className="text-xl text-white/60" />
                    </div>
                    <span className="text-xs text-white/40">
                      {formatDate(doc.updatedAt)}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-semibold text-white mb-3 line-clamp-2 group-hover:text-white/90 transition-colors">
                    {doc.title || 'Untitled'}
                  </h3>

                  {/* Preview */}
                  <p className="text-sm text-white/50 line-clamp-3 leading-relaxed">
                    {getDocumentPreview(doc.content || [])}
                  </p>

                  {/* Hover indicator */}
                  <div className="mt-4 flex items-center gap-2 text-white/40 group-hover:text-white/60 transition-colors">
                    <span className="text-xs font-medium">Open</span>
                    <svg
                      className="w-4 h-4 transform group-hover:translate-x-1 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default HomePage;

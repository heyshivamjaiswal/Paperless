import '@blocknote/core/fonts/inter.css';
import '@blocknote/shadcn/style.css';

import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { BlockNoteView } from '@blocknote/shadcn';
import { useCreateBlockNote } from '@blocknote/react';
import { usePagesStore } from '../store/pageStore';
import { BlockNoteSchema, defaultBlockSpecs } from '@blocknote/core';
import type { DefaultReactSuggestionItem } from '@blocknote/react';
import { getDefaultReactSlashMenuItems } from '@blocknote/react';
import { useAIStore } from '../store/Aistore';
import { fixTextWithAI } from '../utils/GroqServices';
import { HiSparkles, HiCheckCircle } from 'react-icons/hi';

const API_BASE = import.meta.env.VITE_API_BASE_URL;

const EMPTY_DOCUMENT = [
  {
    type: 'heading',
    props: { level: 1 },
    content: [{ type: 'text', text: 'Untitled' }],
  },
  { type: 'paragraph', content: [] },
];

function getTitleFromDoc(blocks: any[]) {
  const h1 = blocks.find((b) => b.type === 'heading' && b.props?.level === 1);
  if (!h1) return 'Untitled';

  const titleText = h1.content
    ?.map((c: any) => c.text)
    .join('')
    .trim();

  return titleText !== undefined ? titleText : 'Untitled';
}

function isLikelyCode(text: string): boolean {
  const codeIndicators = [
    /^(import|export|const|let|var|function|class|interface|type)\s/m,
    /[{}\[\]();]/g,
    /=>/,
    /\b(if|else|for|while|return|async|await)\b/,
    /\bfunction\s+\w+\s*\(/,
    /^\s*\/\//m,
    /^\s*\/\*/m,
  ];

  let score = 0;
  for (const pattern of codeIndicators) {
    if (pattern.test(text)) score++;
  }

  return (
    score >= 3 || /^(import|export|function|class|const|let|var)/.test(text)
  );
}

export default function BlockEditor() {
  const { pageId } = useParams<{ pageId: string }>();
  const navigate = useNavigate();

  const saveTimer = useRef<any>(null);
  const docIdRef = useRef<string | null>(null);
  const isFirstLoad = useRef(true);
  const [canSave, setCanSave] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // AI state
  const apiKey = useAIStore((s) => s.apiKey);
  const [showAIButtons, setShowAIButtons] = useState(false);
  const [aiButtonPosition, setAIButtonPosition] = useState({ x: 0, y: 0 });
  const [selectedText, setSelectedText] = useState('');
  const [isAIProcessing, setIsAIProcessing] = useState(false);

  const addPage = usePagesStore((s) => s.addPage);
  const updatePage = usePagesStore((s) => s.updatePage);

  const schema = BlockNoteSchema.create({
    blockSpecs: {
      ...defaultBlockSpecs,
    },
  });

  const getCustomSlashMenuItems = (
    editor: typeof schema.BlockNoteEditor
  ): DefaultReactSuggestionItem[] => {
    const defaultItems = getDefaultReactSlashMenuItems(editor);

    return [
      ...defaultItems.filter((item) =>
        [
          'Heading 1',
          'Heading 2',
          'Heading 3',
          'Paragraph',
          'Numbered List',
          'Bullet List',
          'Check List',
        ].includes(item.title)
      ),
      ...defaultItems.filter((item) =>
        ['Image', 'Video', 'Audio', 'File'].includes(item.title)
      ),
      ...defaultItems.filter((item) =>
        ['Table', 'Code Block'].includes(item.title)
      ),
    ];
  };

  const editor = useCreateBlockNote({
    schema,
    initialContent: EMPTY_DOCUMENT,
    slashMenuItems: getCustomSlashMenuItems as any,
  });

  // Handle text selection for AI buttons
  useEffect(() => {
    if (!apiKey) return;

    const handleSelectionChange = () => {
      const selection = window.getSelection();
      const text = selection?.toString().trim();

      if (text && text.length > 10) {
        const range = selection?.getRangeAt(0);
        const rect = range?.getBoundingClientRect();

        if (rect) {
          setSelectedText(text);
          setAIButtonPosition({
            x: rect.left + rect.width / 2,
            y: rect.top - 10,
          });
          setShowAIButtons(true);
        }
      } else {
        setShowAIButtons(false);
      }
    };

    document.addEventListener('selectionchange', handleSelectionChange);

    return () => {
      document.removeEventListener('selectionchange', handleSelectionChange);
    };
  }, [apiKey]);

  // AI fix handler
  const handleAIFix = async (type: 'grammar' | 'improve') => {
    if (!selectedText || !apiKey || isAIProcessing) return;

    setIsAIProcessing(true);
    setShowAIButtons(false);

    try {
      const result = await fixTextWithAI(selectedText, apiKey, type);

      if (result.error) {
        alert(result.error);
      } else if (result.text) {
        // Replace selected text
        document.execCommand('insertText', false, result.text);
      }
    } catch (error) {
      console.error('AI error:', error);
      alert('Failed to process AI request');
    } finally {
      setIsAIProcessing(false);
    }
  };

  // Handle paste event to auto-detect code
  useEffect(() => {
    const handlePaste = async (event: ClipboardEvent) => {
      const text = event.clipboardData?.getData('text');

      if (text && isLikelyCode(text)) {
        event.preventDefault();

        const currentBlock = editor.getTextCursorPosition().block;
        editor.insertBlocks(
          [
            {
              type: 'codeBlock',
              props: { language: 'javascript' },
              content: [{ type: 'text', text, styles: {} }],
            },
          ],
          currentBlock,
          'after'
        );
      }
    };

    const editorElement = document.querySelector('.bn-container');
    editorElement?.addEventListener('paste', handlePaste as any);

    return () => {
      editorElement?.removeEventListener('paste', handlePaste as any);
    };
  }, [editor]);

  // Auto-save handler
  useEffect(() => {
    const handleChange = async () => {
      if (!canSave || !docIdRef.current || isFirstLoad.current) {
        return;
      }

      clearTimeout(saveTimer.current);

      saveTimer.current = setTimeout(async () => {
        const currentDocId = docIdRef.current;
        if (!currentDocId) return;

        const content = editor.document;
        const docTitle = getTitleFromDoc(content);

        try {
          const res = await fetch(`${API_BASE}/api/docs/${currentDocId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ title: docTitle, content }),
          });

          if (!res.ok) return;

          await res.json();

          if (updatePage) {
            updatePage(currentDocId, { title: docTitle, content });
          }
        } catch (error) {
          console.error('Save error:', error);
        }
      }, 600);
    };

    return editor.onChange(handleChange);
  }, [editor, canSave, updatePage]);

  // Document loading
  useEffect(() => {
    const load = async () => {
      setCanSave(false);
      setIsLoading(true);
      isFirstLoad.current = true;
      docIdRef.current = null;
      clearTimeout(saveTimer.current);

      try {
        if (pageId === 'new') {
          // FIXED: Removed "http://localhost:3000" - only use API_BASE
          const res = await fetch(`${API_BASE}/api/docs`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({
              title: 'Untitled',
              content: EMPTY_DOCUMENT,
            }),
          });

          if (!res.ok) {
            setIsLoading(false);
            return;
          }

          const doc = await res.json();
          addPage(doc);
          navigate(`/page/${doc._id}`, { replace: true });
          return;
        }

        const res = await fetch(`${API_BASE}/api/docs/${pageId}`, {
          credentials: 'include',
        });

        if (!res.ok) {
          if (res.status === 404) {
            navigate('/page/new', { replace: true });
          }
          setIsLoading(false);
          return;
        }

        const doc = await res.json();
        docIdRef.current = doc._id;

        const contentToLoad = doc.content?.length
          ? doc.content
          : EMPTY_DOCUMENT;

        await new Promise((resolve) => setTimeout(resolve, 50));

        try {
          const currentBlocks = editor.document;
          editor.replaceBlocks(currentBlocks, contentToLoad);

          setTimeout(() => {
            isFirstLoad.current = false;
            setCanSave(true);
            setIsLoading(false);
          }, 100);
        } catch (error) {
          console.error('Content load error:', error);
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Load error:', error);
        setIsLoading(false);
      }
    };

    if (pageId) {
      load();
    }

    return () => {
      clearTimeout(saveTimer.current);
    };
  }, [pageId, editor, navigate, addPage]);

  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-black">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-white/20 border-t-white/60 rounded-full animate-spin" />
          <div className="text-sm text-white/40">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="w-full h-full bg-black overflow-y-auto editor-wrapper">
        <BlockNoteView
          editor={editor}
          theme="dark"
          className="editor-content"
        />
      </div>

      {/* AI Quick Fix Buttons */}
      {showAIButtons && !isAIProcessing && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowAIButtons(false)}
          />
          <div
            className="fixed z-50 flex gap-2"
            style={{
              left: aiButtonPosition.x,
              top: aiButtonPosition.y,
              transform: 'translate(-50%, -100%)',
            }}
          >
            <button
              onClick={() => handleAIFix('grammar')}
              className="px-3 py-1.5 bg-[#1c1c1e] border border-white/[0.15] rounded-lg
                       hover:bg-white/[0.08] transition-all flex items-center gap-2
                       text-sm text-white shadow-xl"
            >
              <HiCheckCircle className="text-green-400" />
              Fix Grammar
            </button>
            <button
              onClick={() => handleAIFix('improve')}
              className="px-3 py-1.5 bg-[#1c1c1e] border border-white/[0.15] rounded-lg
                       hover:bg-white/[0.08] transition-all flex items-center gap-2
                       text-sm text-white shadow-xl"
            >
              <HiSparkles className="text-purple-400" />
              Improve
            </button>
          </div>
        </>
      )}

      {/* AI Processing Indicator */}
      {isAIProcessing && (
        <div className="fixed bottom-8 right-8 bg-white text-black px-4 py-2 rounded-lg shadow-lg flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
          <span className="text-sm font-medium">AI is processing...</span>
        </div>
      )}
    </>
  );
}

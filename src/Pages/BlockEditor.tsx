// // import '@blocknote/core/fonts/inter.css';
// // import '@blocknote/shadcn/style.css';

// // import { useEffect, useRef, useState } from 'react';
// // import { useNavigate, useParams } from 'react-router-dom';
// // import { BlockNoteView } from '@blocknote/shadcn';
// // import { useCreateBlockNote } from '@blocknote/react';
// // import { usePagesStore } from '../store/pageStore';

// // const EMPTY_DOCUMENT = [
// //   {
// //     type: 'heading',
// //     props: { level: 1 },
// //     content: [{ type: 'text', text: 'Untitled' }],
// //   },
// //   { type: 'paragraph', content: [] },
// // ];

// // function getTitleFromDoc(blocks: any[]) {
// //   const h = blocks.find((b) => b.type === 'heading' && b.props?.level === 1);
// //   if (!h) return 'Untitled';
// //   return (
// //     h.content
// //       ?.map((c: any) => c.text)
// //       .join('')
// //       .trim() || 'Untitled'
// //   );
// // }

// // export default function BlockEditor() {
// //   const { pageId } = useParams<{ pageId: string }>();
// //   const navigate = useNavigate();

// //   const saveTimer = useRef<any>(null);
// //   const docIdRef = useRef<string | null>(null);
// //   const isFirstLoad = useRef(true);
// //   const [canSave, setCanSave] = useState(false);
// //   const [isLoading, setIsLoading] = useState(true);

// //   // Get store actions
// //   const addPage = usePagesStore((s) => s.addPage);
// //   const updatePage = usePagesStore((s) => s.updatePage);

// //   const editor = useCreateBlockNote({
// //     initialContent: EMPTY_DOCUMENT,
// //   });

// //   // Handle auto-save
// //   useEffect(() => {
// //     const handleChange = async () => {
// //       // Don't save if we're not ready or during initial load
// //       if (!canSave || !docIdRef.current || isFirstLoad.current) {
// //         return;
// //       }

// //       clearTimeout(saveTimer.current);

// //       saveTimer.current = setTimeout(async () => {
// //         const currentDocId = docIdRef.current;
// //         if (!currentDocId) return;

// //         const content = editor.document;
// //         const title = getTitleFromDoc(content);

// //         try {
// //           const res = await fetch(
// //             `http://localhost:3000/api/docs/${currentDocId}`,
// //             {
// //               method: 'PUT',
// //               headers: { 'Content-Type': 'application/json' },
// //               credentials: 'include',
// //               body: JSON.stringify({ title, content }),
// //             }
// //           );

// //           if (!res.ok) {
// //             return;
// //           }

// //           const updatedDoc = await res.json();

// //           // Update the store
// //           if (updatePage) {
// //             updatePage(currentDocId, { title, content });
// //           }
// //         } catch (error) {}
// //       }, 600);
// //     };

// //     return editor.onChange(handleChange);
// //   }, [editor, canSave, updatePage]);

// //   // Handle loading/creating documents
// //   useEffect(() => {
// //     const load = async () => {
// //       // Reset state
// //       setCanSave(false);
// //       setIsLoading(true);
// //       isFirstLoad.current = true;
// //       docIdRef.current = null;
// //       clearTimeout(saveTimer.current);

// //       try {
// //         // CREATE NEW DOCUMENT
// //         if (pageId === 'new') {
// //           const res = await fetch('http://localhost:3000/api/docs', {
// //             method: 'POST',
// //             headers: { 'Content-Type': 'application/json' },
// //             credentials: 'include',
// //             body: JSON.stringify({
// //               title: 'Untitled',
// //               content: EMPTY_DOCUMENT,
// //             }),
// //           });

// //           if (!res.ok) {
// //             setIsLoading(false);
// //             return;
// //           }

// //           const doc = await res.json();

// //           // Add to store
// //           addPage(doc);

// //           // Navigate to the new document (this will trigger a reload)
// //           navigate(`/page/${doc._id}`, { replace: true });
// //           return;
// //         }

// //         // LOAD EXISTING DOCUMENT
// //         console.log('📥 Fetching document:', pageId);
// //         const res = await fetch(`http://localhost:3000/api/docs/${pageId}`, {
// //           credentials: 'include',
// //         });

// //         if (!res.ok) {
// //           if (res.status === 404) {
// //             navigate('/page/new', { replace: true });
// //           }
// //           setIsLoading(false);
// //           return;
// //         }

// //         const doc = await res.json();

// //         docIdRef.current = doc._id;

// //         // Prepare content
// //         const contentToLoad = doc.content?.length
// //           ? doc.content
// //           : EMPTY_DOCUMENT;

// //         // Wait a bit to ensure editor is ready, then replace content
// //         await new Promise((resolve) => setTimeout(resolve, 50));

// //         try {
// //           // Get all current blocks
// //           const currentBlocks = editor.document;

// //           // Replace all blocks with new content
// //           editor.replaceBlocks(currentBlocks, contentToLoad);

// //           // Enable saving after a short delay
// //           setTimeout(() => {
// //             isFirstLoad.current = false;
// //             setCanSave(true);
// //             setIsLoading(false);
// //             console.log('✅ Editor ready for editing');
// //           }, 100);
// //         } catch (error) {
// //           setIsLoading(false);
// //         }
// //       } catch (error) {
// //         setIsLoading(false);
// //       }
// //     };

// //     if (pageId) {
// //       load();
// //     }

// //     // Cleanup
// //     return () => {
// //       clearTimeout(saveTimer.current);
// //     };
// //   }, [pageId, editor, navigate, addPage]);

// //   if (isLoading) {
// //     return (
// //       <div className="w-full h-full flex items-center justify-center bg-transparent text-white">
// //         <div className="text-lg">Loading...</div>
// //       </div>
// //     );
// //   }

// //   return (
// //     <BlockNoteView
// //       editor={editor}
// //       className="w-full h-full bg-transparent text-white pl-28 pt-24"
// //     />
// //   );
// // }

// import '@blocknote/core/fonts/inter.css';
// import '@blocknote/shadcn/style.css';

// import { useEffect, useRef, useState } from 'react';
// import { useNavigate, useParams } from 'react-router-dom';
// import { BlockNoteView } from '@blocknote/shadcn';
// import { useCreateBlockNote } from '@blocknote/react';
// import { usePagesStore } from '../store/pageStore';
// import { BlockNoteSchema, defaultBlockSpecs } from '@blocknote/core';
// import type { DefaultReactSuggestionItem } from '@blocknote/react';
// import { getDefaultReactSlashMenuItems } from '@blocknote/react';

// const EMPTY_DOCUMENT = [
//   {
//     type: 'heading',
//     props: { level: 1 },
//     content: [{ type: 'text', text: 'Untitled' }],
//   },
//   { type: 'paragraph', content: [] },
// ];

// function getTitleFromDoc(blocks: any[]) {
//   const h = blocks.find((b) => b.type === 'heading' && b.props?.level === 1);
//   if (!h) return 'Untitled';
//   return (
//     h.content
//       ?.map((c: any) => c.text)
//       .join('')
//       .trim() || 'Untitled'
//   );
// }

// // Detect if pasted content is code
// function isLikelyCode(text: string): boolean {
//   const codeIndicators = [
//     /^(import|export|const|let|var|function|class|interface|type)\s/m,
//     /[{}\[\]();]/g,
//     /=>/,
//     /\b(if|else|for|while|return|async|await)\b/,
//     /\bfunction\s+\w+\s*\(/,
//     /^\s*\/\//m,
//     /^\s*\/\*/m,
//   ];

//   let score = 0;
//   for (const pattern of codeIndicators) {
//     if (pattern.test(text)) score++;
//   }

//   // If 3+ indicators or has common code patterns, likely code
//   return (
//     score >= 3 || /^(import|export|function|class|const|let|var)/.test(text)
//   );
// }

// export default function BlockEditor() {
//   const { pageId } = useParams<{ pageId: string }>();
//   const navigate = useNavigate();

//   const saveTimer = useRef<any>(null);
//   const docIdRef = useRef<string | null>(null);
//   const isFirstLoad = useRef(true);
//   const [canSave, setCanSave] = useState(false);
//   const [isLoading, setIsLoading] = useState(true);

//   const addPage = usePagesStore((s) => s.addPage);
//   const updatePage = usePagesStore((s) => s.updatePage);

//   const schema = BlockNoteSchema.create({
//     blockSpecs: {
//       ...defaultBlockSpecs,
//     },
//   });

//   const getCustomSlashMenuItems = (
//     editor: typeof schema.BlockNoteEditor
//   ): DefaultReactSuggestionItem[] => {
//     const defaultItems = getDefaultReactSlashMenuItems(editor);

//     return [
//       ...defaultItems.filter((item) =>
//         [
//           'Heading 1',
//           'Heading 2',
//           'Heading 3',
//           'Paragraph',
//           'Numbered List',
//           'Bullet List',
//           'Check List',
//         ].includes(item.title)
//       ),
//       ...defaultItems.filter((item) =>
//         ['Image', 'Video', 'Audio', 'File'].includes(item.title)
//       ),
//       ...defaultItems.filter((item) =>
//         ['Table', 'Code Block'].includes(item.title)
//       ),
//     ];
//   };

//   const editor = useCreateBlockNote({
//     schema,
//     initialContent: EMPTY_DOCUMENT,
//     slashMenuItems: getCustomSlashMenuItems as any,
//   });

//   // Handle paste event to auto-detect code
//   useEffect(() => {
//     const handlePaste = async (event: ClipboardEvent) => {
//       const text = event.clipboardData?.getData('text');

//       if (text && isLikelyCode(text)) {
//         event.preventDefault();

//         // Insert as code block
//         const currentBlock = editor.getTextCursorPosition().block;
//         editor.insertBlocks(
//           [
//             {
//               type: 'codeBlock',
//               props: { language: 'javascript' },
//               content: [{ type: 'text', text, styles: {} }],
//             },
//           ],
//           currentBlock,
//           'after'
//         );
//       }
//     };

//     const editorElement = document.querySelector('.bn-container');
//     editorElement?.addEventListener('paste', handlePaste as any);

//     return () => {
//       editorElement?.removeEventListener('paste', handlePaste as any);
//     };
//   }, [editor]);

//   // Auto-save handler
//   useEffect(() => {
//     const handleChange = async () => {
//       if (!canSave || !docIdRef.current || isFirstLoad.current) {
//         return;
//       }

//       clearTimeout(saveTimer.current);

//       saveTimer.current = setTimeout(async () => {
//         const currentDocId = docIdRef.current;
//         if (!currentDocId) return;

//         const content = editor.document;
//         const title = getTitleFromDoc(content);

//         try {
//           const res = await fetch(
//             `http://localhost:3000/api/docs/${currentDocId}`,
//             {
//               method: 'PUT',
//               headers: { 'Content-Type': 'application/json' },
//               credentials: 'include',
//               body: JSON.stringify({ title, content }),
//             }
//           );

//           if (!res.ok) return;

//           await res.json();

//           if (updatePage) {
//             updatePage(currentDocId, { title, content });
//           }
//         } catch (error) {
//           console.error('Save error:', error);
//         }
//       }, 600);
//     };

//     return editor.onChange(handleChange);
//   }, [editor, canSave, updatePage]);

//   // Document loading
//   useEffect(() => {
//     const load = async () => {
//       setCanSave(false);
//       setIsLoading(true);
//       isFirstLoad.current = true;
//       docIdRef.current = null;
//       clearTimeout(saveTimer.current);

//       try {
//         if (pageId === 'new') {
//           const res = await fetch('http://localhost:3000/api/docs', {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             credentials: 'include',
//             body: JSON.stringify({
//               title: 'Untitled',
//               content: EMPTY_DOCUMENT,
//             }),
//           });

//           if (!res.ok) {
//             setIsLoading(false);
//             return;
//           }

//           const doc = await res.json();
//           addPage(doc);
//           navigate(`/page/${doc._id}`, { replace: true });
//           return;
//         }

//         const res = await fetch(`http://localhost:3000/api/docs/${pageId}`, {
//           credentials: 'include',
//         });

//         if (!res.ok) {
//           if (res.status === 404) {
//             navigate('/page/new', { replace: true });
//           }
//           setIsLoading(false);
//           return;
//         }

//         const doc = await res.json();
//         docIdRef.current = doc._id;

//         const contentToLoad = doc.content?.length
//           ? doc.content
//           : EMPTY_DOCUMENT;

//         await new Promise((resolve) => setTimeout(resolve, 50));

//         try {
//           const currentBlocks = editor.document;
//           editor.replaceBlocks(currentBlocks, contentToLoad);

//           setTimeout(() => {
//             isFirstLoad.current = false;
//             setCanSave(true);
//             setIsLoading(false);
//           }, 100);
//         } catch (error) {
//           console.error('Content load error:', error);
//           setIsLoading(false);
//         }
//       } catch (error) {
//         console.error('Load error:', error);
//         setIsLoading(false);
//       }
//     };

//     if (pageId) {
//       load();
//     }

//     return () => {
//       clearTimeout(saveTimer.current);
//     };
//   }, [pageId, editor, navigate, addPage]);

//   if (isLoading) {
//     return (
//       <div className="w-full h-full flex items-center justify-center">
//         <div className="flex flex-col items-center gap-3">
//           <div className="w-8 h-8 border-2 border-white/20 border-t-white/80 rounded-full animate-spin" />
//           <div className="text-sm text-white/60">Loading...</div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="editor-wrapper">
//       <BlockNoteView editor={editor} theme="dark" className="editor-content" />
//     </div>
//   );
// }

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

const EMPTY_DOCUMENT = [
  {
    type: 'heading',
    props: { level: 1 },
    content: [{ type: 'text', text: 'Untitled' }],
  },
  { type: 'paragraph', content: [] },
];

function getTitleFromDoc(blocks: any[]) {
  const h = blocks.find((b) => b.type === 'heading' && b.props?.level === 1);
  if (!h) return 'Untitled';
  return (
    h.content
      ?.map((c: any) => c.text)
      .join('')
      .trim() || 'Untitled'
  );
}

// Detect if pasted content is code
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

  // If 3+ indicators or has common code patterns, likely code
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

  // Handle paste event to auto-detect code
  useEffect(() => {
    const handlePaste = async (event: ClipboardEvent) => {
      const text = event.clipboardData?.getData('text');

      if (text && isLikelyCode(text)) {
        event.preventDefault();

        // Insert as code block
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
        const title = getTitleFromDoc(content);

        try {
          const res = await fetch(
            `http://localhost:3000/api/docs/${currentDocId}`,
            {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              credentials: 'include',
              body: JSON.stringify({ title, content }),
            }
          );

          if (!res.ok) return;

          await res.json();

          if (updatePage) {
            updatePage(currentDocId, { title, content });
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
          const res = await fetch('http://localhost:3000/api/docs', {
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

        const res = await fetch(`http://localhost:3000/api/docs/${pageId}`, {
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
      <div className="w-full h-full flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-white/20 border-t-white/80 rounded-full animate-spin" />
          <div className="text-sm text-white/60">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="editor-wrapper">
      <BlockNoteView editor={editor} theme="dark" className="editor-content" />
    </div>
  );
}

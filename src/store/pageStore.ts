import { create } from 'zustand';
import { nanoid } from 'nanoid';

export type Page = {
  id: string;
  title: string;
  content: any[]; // BlockNote blocks
  createdAt: number;
  titleManuallyEdited: boolean;
};

type PagesState = {
  pages: Page[];
  activePageId: string | null;

  // IMPORTANT: createPage RETURNS the id
  createPage: () => string;

  setActivePage: (id: string) => void;
  updatePageContent: (id: string, content: any[]) => void;
  updatePageTitle: (id: string, title: string, manual?: boolean) => void;
  removePage: (id: string) => void;
  resetPage: (id: string) => void;
};

export const usePagesStore = create<PagesState>((set) => ({
  pages: [],
  activePageId: null,

  /* ---------------------------------------------
     Create Page (Notion-style)
     - returns id
     - inserts H1 as first block
  ---------------------------------------------- */
  createPage: () => {
    const id = nanoid();

    const newPage: Page = {
      id,
      title: 'Untitled',
      titleManuallyEdited: false,
      createdAt: Date.now(),
      content: [
        {
          type: 'heading',
          props: { level: 1 },
          content: [
            {
              type: 'text',
              text: 'Untitled',
              styles: {},
            },
          ],
        },
        {
          type: 'paragraph',
          content: [],
        },
      ],
    };

    set((state) => ({
      pages: [newPage, ...state.pages],
      activePageId: id, // still safe even if unused
    }));

    return id; // 🔑 REQUIRED for routing
  },

  setActivePage: (id) =>
    set(() => ({
      activePageId: id,
    })),

  updatePageContent: (id, content) =>
    set((state) => ({
      pages: state.pages.map((p) => (p.id === id ? { ...p, content } : p)),
    })),

  updatePageTitle: (id, title, manual = false) =>
    set((state) => ({
      pages: state.pages.map((p) =>
        p.id === id
          ? {
              ...p,
              title,
              titleManuallyEdited: manual ? true : p.titleManuallyEdited,
            }
          : p
      ),
    })),

  removePage: (id) =>
    set((state) => {
      const newPages = state.pages.filter((p) => p.id !== id);

      return {
        pages: newPages,
        activePageId:
          state.activePageId === id
            ? newPages.length > 0
              ? newPages[0].id
              : null
            : state.activePageId,
      };
    }),

  resetPage: (id: string) =>
    set((state) => ({
      pages: state.pages.map((p) =>
        p.id === id
          ? {
              ...p,
              title: 'Untitled',
              content: [],
              titleManuallyEdited: false,
            }
          : p
      ),
    })),
}));

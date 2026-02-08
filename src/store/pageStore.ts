import { create } from 'zustand';

export type Page = {
  _id: string;
  title: string;
  content: any[];
  updatedAt: string;
};

type PagesState = {
  pages: Page[];
  setPages: (pages: Page[]) => void;
  addPage: (page: Page) => void;
  updatePage: (id: string, updates: Partial<Page>) => void;
  removePage: (id: string) => void;
};

export const usePagesStore = create<PagesState>((set) => ({
  pages: [],

  setPages: (pages) => set({ pages }),

  addPage: (page) =>
    set((state) => ({
      pages: [page, ...state.pages],
    })),

  updatePage: (id, updates) =>
    set((state) => ({
      pages: state.pages.map((p) =>
        p._id === id
          ? { ...p, ...updates, updatedAt: new Date().toISOString() }
          : p
      ),
    })),

  removePage: (id) =>
    set((state) => ({
      pages: state.pages.filter((p) => p._id !== id),
    })),
}));

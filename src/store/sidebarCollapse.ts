import { create } from 'zustand';

interface OpenState {
  open: boolean;
  toggle: () => void;
}

export const useOpen = create<OpenState>((set) => ({
  open: true,

  toggle: () =>
    set((state) => ({
      open: !state.open,
    })),
}));

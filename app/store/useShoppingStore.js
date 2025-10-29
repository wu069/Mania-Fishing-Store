// app/store/useShoppingStore.js
import { create } from 'zustand';

export const useShoppingStore = create((set) => ({
  items: [],

  tambahItem: (itemBaru) =>
    set((state) => ({
      items: [
        ...state.items,
        { id: Date.now(), sudahDibeli: false, ...itemBaru },
      ],
    })),

  hapusItem: (id) =>
    set((state) => ({
      items: state.items.filter((item) => item.id !== id),
    })),

  toggleSudahDibeli: (id) =>
    set((state) => ({
      items: state.items.map((item) =>
        item.id === id ? { ...item, sudahDibeli: !item.sudahDibeli } : item
      ),
    })),
}));

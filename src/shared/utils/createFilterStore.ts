import { create } from "zustand";

type FilterState = {
  searchQuery: string;
  page: number;
  limit: number;
  count: number;
  setPage: (page: number) => void;
  nextPage: () => void;
  prevPage: () => void;
  setLimit: (limit: number) => void;
  setSearchQuery: (query: string) => void;
  clearSearchQuery: () => void;
  setCount: (count: number) => void;
};

const createFilterStore = () =>
  create<FilterState>((set) => ({
    searchQuery: "",
    page: 0,
    limit: 10,
    count: 0,
    setCount: (count: number) => set({ count }),
    setSearchQuery: (query) => set({ searchQuery: query }),
    clearSearchQuery: () => set({ searchQuery: "" }),
    setPage: (page) => set({ page }),
    nextPage: () => set((state) => ({ page: state.page + 1 })),
    prevPage: () => set((state) => ({ page: state.page - 1 })),
    setLimit: (limit) => set({ limit }),
  }));

export default createFilterStore;

import { create } from "zustand";

type FilterState<T> = {
  searchQuery: string;
  page: number;
  limit: number;
  count: number;
  ascending: boolean;
  orderBy: T;
  setPage: (page: number) => void;
  nextPage: () => void;
  prevPage: () => void;
  setLimit: (limit: number) => void;
  setSearchQuery: (query: string) => void;
  clearSearchQuery: () => void;
  setCount: (count: number) => void;
  setOrderBy: (orderBy: string) => void;
  setAscending: (asc: boolean) => void;
};

const createFilterStore = ({ properties }: { properties: string[] }) =>
  create<FilterState<(typeof properties)[number]>>((set) => ({
    searchQuery: "",
    page: 0,
    limit: 10,
    count: 0,
    orderBy: properties[0],
    ascending: true,
    setCount: (count: number) => set({ count }),
    setSearchQuery: (query) => set({ searchQuery: query, page: 0 }),
    clearSearchQuery: () => set({ searchQuery: "" }),
    setPage: (page) => set({ page }),
    nextPage: () => set((state) => ({ page: state.page + 1 })),
    prevPage: () => set((state) => ({ page: state.page - 1 })),
    setLimit: (limit) => set({ limit }),
    setOrderBy: (orderBy) => set({ orderBy }),
    setAscending: (ascending) => set({ ascending }),
  }));

export default createFilterStore;

import { create } from "zustand";

export type DateFilter = "week" | "month" | "year";

export type DateFilterState = {
  dateFilter: DateFilter;
  setDateFilter: (dateFilter: DateFilter) => void;
};

export const createTimeFilter = () =>
  create<DateFilterState>((set) => ({
    dateFilter: "week",
    setDateFilter: (dateFilter) => set({ dateFilter }),
  }));

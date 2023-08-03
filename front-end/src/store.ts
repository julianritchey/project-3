import { create } from "zustand";

interface StrategyQuery {
  sortOrder?: string;
  searchText?: string;
}

interface StrategyQueryStore {
  strategyQuery: StrategyQuery;
  setSearchText: (searchText: string) => void;
  setSortOrder: (sortOrder: string) => void;
}

const useStrategyQueryStore = create<StrategyQueryStore>((set) => ({
  strategyQuery: {},
  setSearchText: (searchText) => set(() => ({ strategyQuery: { searchText } })),
  setSortOrder: (sortOrder) =>
    set((store) => ({ strategyQuery: { ...store.strategyQuery, sortOrder } })),
}));

export default useStrategyQueryStore;

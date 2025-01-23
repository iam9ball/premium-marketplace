import { create } from 'zustand';

// Define the type for the mutation function
type MutateFn = (() => void) | (() => Promise<void>) | null;

// Interface for the store state
interface ListingsState {
  mutate: MutateFn;
//   isLoading: boolean;
}

// Interface for the store actions
interface ListingsActions {
  setMutate: (mutateFn: MutateFn) => void;
  refreshListings: () => void;
  totalCount: number;
    setTotalCount: (length: number) => void;
}

// Combined interface for the entire store
interface ListingsStore extends ListingsState, ListingsActions {}

// Create the typed store
const useListingsStore = create<ListingsStore>((set) => ({
  // Initial state
  mutate: null,
  totalCount: 0,
//   isLoading: false,

  // Actions
  setTotalCount: (length: number) =>  set({totalCount: length}),

  refreshListings: () => {
    set((state) => {
      state.mutate?.();
      return state;
    });
  },

  setMutate: (mutateFn: MutateFn) => {
    set((state) => {
      if (state.mutate !== mutateFn) {
        return { mutate: mutateFn };
      }
      return state;
    });
  },
}));

export default useListingsStore;
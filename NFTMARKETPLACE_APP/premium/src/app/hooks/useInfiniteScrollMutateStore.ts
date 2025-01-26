import {create} from "zustand";

type MutateFn = (() => void) | (() => Promise<void>) | null;

interface InfiniteScrollMutateStore {
 mutate: MutateFn;
 refreshListings: MutateFn;
  setMutateListings: (mutateFn: MutateFn) => void | null; 
  }

  const useInfiniteScrollMutateStore = create<InfiniteScrollMutateStore>((set) => ({
    mutate: null,
    refreshListings: async() => {
    set((state) => {
      state.mutate?.();
      return state;
    });
  },

  setMutateListings: (mutateFn: MutateFn) => {
    set((state) => {
      if (state.mutate !== mutateFn) {
        return { mutate: mutateFn };
      }
      return state;
    });
  },
   
    
    
  }));
  
  export default useInfiniteScrollMutateStore;
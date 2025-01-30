import {create} from "zustand";

type MutateFn = (() => void) | (() => Promise<void>) | null;
type Mutate =  "marketplaceMutate" | "dashboardMutate";

interface InfiniteScrollMutateStore {
 dashboardMutate: MutateFn;
 marketplaceMutate: MutateFn;
 marketplaceRefreshListings: MutateFn;
 dashboardRefreshListings: MutateFn;
  setMutateListings: (mutate: Mutate, mutateFn: MutateFn) => void | null; 
  }

  const useInfiniteScrollMutateStore = create<InfiniteScrollMutateStore>((set) => ({
    dashboardMutate: null,
    marketplaceMutate: null,
    marketplaceRefreshListings: async() => {
    set((state) => {
      state.marketplaceMutate?.();
      return state;
    });
  },
    dashboardRefreshListings: async() => {
    set((state) => {
      state.dashboardMutate?.();
      return state;
    });
  },

  setMutateListings: (mutate: string, mutateFn: MutateFn) => {
    set((state) => {
      if (mutate === "marketplaceMutate" && state.marketplaceMutate !== mutateFn) {
        return { marketplaceMutate: mutateFn };
      }
      else if (mutate === "dashboardMutate" && state.dashboardMutate !== mutateFn) {
        return { dashboardMutate: mutateFn };
      }
      return state;
    });
  },
   
    
    
  }));
  
  export default useInfiniteScrollMutateStore;
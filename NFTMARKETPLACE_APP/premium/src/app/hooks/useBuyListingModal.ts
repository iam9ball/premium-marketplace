import {create} from "zustand";

interface BuyListingModalStore {
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
    listingId: bigint | null;
    setListingId: (id: bigint) => void;
    mutateListings: () => Promise<void>;
  setMutateListings: (fn: () => Promise<void>) => void; 

   
}

const useBuyListingModal = create<BuyListingModalStore>((set) => ({
  isOpen: false,
  listingId: null,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
 setListingId: (id) => set({listingId: id}),
 mutateListings: async() => {},
 setMutateListings: async(fn) => set({mutateListings: fn})
}));

export default useBuyListingModal;

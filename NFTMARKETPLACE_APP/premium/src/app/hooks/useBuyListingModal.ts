import {create} from "zustand";

interface BuyListingModalStore {
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
    listingId: bigint | null;
    setListingId: (id: bigint) => void;
    mutateListings: () => void;
  setMutateListings: (fn: () => void) => void; 

   
}

const useBuyListingModal = create<BuyListingModalStore>((set) => ({
  isOpen: false,
  listingId: null,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
 setListingId: (id) => set({listingId: id}),
 mutateListings: () => {},
 setMutateListings: (fn) => set({mutateListings: fn})
}));

export default useBuyListingModal;

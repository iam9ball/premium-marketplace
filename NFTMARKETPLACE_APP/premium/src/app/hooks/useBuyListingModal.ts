import {create} from "zustand";

interface BuyListingModalStore {
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
    listingId: bigint | null;
    setListingId: (id: bigint) => void;
    
   
}

const useBuyListingModal = create<BuyListingModalStore>((set) => ({
  isOpen: false,
  listingId: null,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
 setListingId: (id) => set({listingId: id})
}));

export default useBuyListingModal;

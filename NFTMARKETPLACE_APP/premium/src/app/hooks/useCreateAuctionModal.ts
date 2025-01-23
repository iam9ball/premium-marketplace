import {create} from "zustand";

interface CreateAuctionModalStore {
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
    mutateListings: () => void;
  setMutateListings: (fn: () => void) => void; 
    
   
}

const useCreateAuctionModal = create<CreateAuctionModalStore>((set) => ({
  isOpen: false,
   mutateListings: () => {},
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
  setMutateListings: (fn) => set({mutateListings: fn})
  
}));

export default useCreateAuctionModal;

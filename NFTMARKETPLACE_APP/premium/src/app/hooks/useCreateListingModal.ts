import {create} from "zustand";

interface CreateListingModalStore {
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
  //   mutateListings: () => void;
  // setMutateListings: (fn: () => void) => void; 
    
   
}

const useCreateListingModal = create<CreateListingModalStore>((set) => ({
  isOpen: false,
  //  mutateListings: () => {},
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
  // setMutateListings: (fn) => set({mutateListings: fn})
  
}));

export default useCreateListingModal;

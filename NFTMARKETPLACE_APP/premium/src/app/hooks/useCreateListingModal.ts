import {create} from "zustand";


interface CreateListingModalStore {
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
   
    
   
}

const useCreateListingModal = create<CreateListingModalStore>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
  
  
  
}));

export default useCreateListingModal;

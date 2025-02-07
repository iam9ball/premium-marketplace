import {create} from "zustand";


interface CreateListingModalStore {
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
    setAddress: (value: string) => void;
    address: string;
   
    
   
}

const useCreateListingModal = create<CreateListingModalStore>((set) => ({
  isOpen: false,
  address: "",
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
  setAddress: (value) => set({address: value})
  
  
  
}));

export default useCreateListingModal;

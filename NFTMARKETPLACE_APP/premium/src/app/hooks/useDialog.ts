import {create} from "zustand";

interface DialogStore {
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
    option: boolean;
    setNo: ()=> void;
    setYes: ()=> void;
   
}

const useDialog = create<DialogStore>((set) => ({
  isOpen: false,
  option: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
  setNo: () => set ({option: false}),
  setYes: () => set ({option: true})
}));

export default useDialog;

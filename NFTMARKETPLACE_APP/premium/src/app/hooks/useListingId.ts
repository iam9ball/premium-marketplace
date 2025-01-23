import {create} from "zustand";

interface ListingIdStore {
    
    listingId: bigint | null;
    setListingId: (id: bigint) => void;

   
}

const useListingId = create<ListingIdStore>((set) => ({
  listingId: null,
 setListingId: (id) => set({listingId: id})
}));



export default useListingId;

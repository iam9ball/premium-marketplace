
import ListingDetails from "./ListingDetails";

import Container from "@/app/components/Container";


interface IParams {
  listingId: string;
}

export default async function ListingPage({ params }: { params: IParams }) {

  

     
  return (
     
     
    <>
     <section className="min-h-[100vh]">
      
       <ListingDetails listingId={params.listingId}/>
      
     </section> 
     
    </>
  );
}

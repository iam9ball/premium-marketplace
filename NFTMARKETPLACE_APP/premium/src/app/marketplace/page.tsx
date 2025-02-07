
import { AuctionMarquee } from "../auction/AuctionMarquee"
import Listings from "./Listings"



export default  function Marketplace() {
 
  return (
   
    <>
   
     <section className="min-h-[100vh] bg-gray-700">
      
      <Listings/>
      <AuctionMarquee/>
     </section> 
     
     
    </>
  )
}

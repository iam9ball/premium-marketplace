import MyAuctions from "./MyAuctions";
import MyListings from "./MyListings";
import MyOffers from "./MyOffers";


export default function Dashboard() {
  return (
    <div className="min-h-[100vh]">
    {/* <MyListings/> */}
    <MyOffers/>
    </div>
  );
}
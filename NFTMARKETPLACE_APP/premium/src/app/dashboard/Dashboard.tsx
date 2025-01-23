import MyAuctions from "./MyAuctions";
import MyListings from "./MyListings";
import MyOffers from "./MyOffers";


export default function Dashboard() {
  return (
    <div className="flex flex-col space-y-4">
      {/* <MyAuctions /> */}
      <MyListings />
      {/* <MyOffers /> */}
    </div>
  );
}
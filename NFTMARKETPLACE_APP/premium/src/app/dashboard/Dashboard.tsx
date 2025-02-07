'use client'
import { useSearchParams } from "next/navigation";
import MyAuctions from "./MyAuctions";
import MyListings from "./MyListings";
import MyOffers from "./MyOffers";
import EmptyState from "../components/EmptyState";



export default function Dashboard() {
  const searchParams = useSearchParams();
  const view = searchParams.get("view");

  switch (view?.toLowerCase()) {
    case "auctions":
      return (
        <div className="min-h-[100vh]">
          <MyAuctions  />
        </div>
      );

    case "offers":
      return (
        <div className="min-h-[100vh]">
          <MyOffers  />
        </div>
      );
    default:
      return (
        <div className="min-h-[100vh]">
          <MyListings  />
        </div>
      );
  }
}

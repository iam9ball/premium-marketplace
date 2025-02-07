import AuctionCommentary from "./AuctionCommentary";
import AuctionDetails from "./AuctionDetails";
import BiddingSystem from "./BiddingSystem";
import LiveChat from "./LiveChat";
import RotatingCube from "./RotatingItem";
import Container from "../components/Container";
import image4 from "@public/image4.jpeg";


export default function AuctionPage() {
  return (
    <div className="min-h-screen w-full bg-gray-900">
      <Container>
        <div className="py-4 min-h-screen flex flex-col">
          {/* Mobile View: Rotating Cube takes full width */}
          <div className="block lg:hidden w-[90%] mb-10">
            <RotatingCube
              frontImage={image4}
              backImage={image4}
              leftImage={image4}
              rightImage={image4}
              topImage={image4}
              bottomImage={image4}
            />
          </div>

          {/* Main Content Grid */}
          <div className="flex flex-col lg:flex-row gap-4 flex-grow">
            {/* Left Column */}
            <div className="w-full lg:w-1/2 flex flex-col gap-4">
              {/* Hide Rotating Cube on mobile, show on desktop */}
              <div className="hidden lg:block">
                <RotatingCube
                  frontImage={image4}
                  backImage={image4}
                  leftImage={image4}
                  rightImage={image4}
                  topImage={image4}
                  bottomImage={image4}
                />
              </div>
              <div className="flex-grow lg:mt-12">
                <AuctionDetails />
              </div>
            </div>

            {/* Right Column */}
            <div className="w-full lg:w-1/2 flex flex-col gap-4">
              <BiddingSystem />
              <AuctionCommentary />
              <LiveChat />
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
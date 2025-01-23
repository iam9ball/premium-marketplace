"use client"
import Container from "../Container";
import Logo from "../Logo";
import Search from "./Search";
import UserMenu from "./UserMenu";
import useWindowScroll from "@/app/hooks/UseWindowScroll";






export default function NavBar() {
    const scrollHeight = useWindowScroll();
  return (                                                                                                                                                                       
    <div className={`${scrollHeight > 60 && "fixed top-0 right-0 left-0 z-50 bg-gray-400 bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-40  border-gray-100"} border-b-[1px] px-4 transition-all duration-300 ease-in-out py-3  w-full bg-white `}>
     
        {/* <Container> */}
          <div className="flex flex-row items-center justify-between gap-3 md:gap-0">
            <Logo />
            <Search />
            <UserMenu />
          </div>
        {/* </Container> */}
      </div>

  );
}

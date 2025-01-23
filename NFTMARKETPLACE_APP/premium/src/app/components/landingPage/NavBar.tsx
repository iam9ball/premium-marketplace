'use client'

import Button from "../Button"
import Logo from "../Logo"
import useWindowScroll from "@/app/hooks/UseWindowScroll";
import Link from "next/link";


export default function NavBar() {

  const scrollHeight = useWindowScroll();
  

  return (
      <div className={`${scrollHeight > 60 && "fixed top-0 right-0 left-0 z-50 bg-gray-400 bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-40 border-b border-gray-100"}  px-4 transition-all duration-300 ease-in-out py-3 w-full`}>
        <div className="flex flex-row items-center justify-between gap-8 md:gap-0">
          <div className="gap-4">
            <Logo/>
          </div>
         <div className="flex items-center justify-between gap-4 ">
          <Link href={'/marketplace'}>
            <Button  actionLabel="Explore" classNames="hover:text-purple-800 hover:font-semibold px-8 text-white bg-black hover:bg-gray-400 hover:opacity-80  py-3 rounded-md capitalize font-light h-10 w-22 text-xs md:text-sm md:h-12 sm:w-28 md:w-36 lg:w-40"/>
          </Link>
          
          <Button variant="connect"/>
         </div>
        
        </div>
        
      </div>
  )
}

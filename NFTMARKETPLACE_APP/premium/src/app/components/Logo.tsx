'use client'
import Image from "next/image"
import premium from "@public/premium.jpeg"
import {useWindowWidth} from "@react-hook/window-size";
import { useMemo } from "react";
import Link from "next/link";

export default function Logo() {

   const width = useWindowWidth();


   const size = useMemo(() => {
    if (width >= 1024) {
      return 44
    }
    else if (width >= 768) {
      return 40
    }
    else {
      return 36
      }
    
  }, [width])

  return (
    <Link href={"/"}>
    <div className="inline-flex items-center justify-center">
      <div className="flex items-center h-auto w-auto">
        <Image 
          src={premium}
          alt="Premium logo"
          height={size}
          width={size}
          className="rounded-xl object-cover"
          priority
        />
       
      </div>
    </div>
    </Link>
  )
}
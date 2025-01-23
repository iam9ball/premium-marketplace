'use client'
import Image from "next/image"
import image1 from "@public/image1.jpg"
import image2 from "@public/image2.jpg"
import image3 from "@public/image3.jpeg"
import image4 from "@public/image4.jpeg"

import useCreateListingModal from "@/app/hooks/useCreateListingModal";
import useCreateNftModal from "@/app/hooks/useCreateNftModal";


import Button from "../Button"




export default function About() {
    const createListingModal = useCreateListingModal();
    const createNftModal = useCreateNftModal();             

    return (
   <div className="px-4 py-16 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-24 lg:px-2 lg:py-36">
        <div className="grid gap-10 lg:grid-cols-2">
          <div className="flex flex-col top-1/4 lg:pr-12">
            <h1 className="font-sans mb-4 text-5xl md:text-6xl text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-600 font-extrabold leading-none">
              One Platform to create, collect {" "}
              <br className="hidden md:block" />
              and sell NFTs
            </h1>
            <p className="font-sans mb-6 text-white text-md py-4 w-fit">
              Premium is an NFT marketplace where you can collect, sell and create NFTs using
              the most popular cryptocurrencies such as MATIC, USDT,etc. Connect your wallet
              and purchase today.
            </p>
            <div className="flex items-center space-x-4">
              <Button actionLabel="Create NFT" onClick={createNftModal.onOpen} classNames="hover:opacity-80 px-8 py-3 rounded-md capitalize font-light h-10 w-22 text-xs md:text-sm md:h-12 sm:w-28 md:w-36 lg:w-40 font-sans bg-purple-800 rounded-md text-white font-medium hover:bg-violet-700 transition ease-in-out duration-300"/>
              <Button actionLabel="List NFT" onClick={createListingModal.onOpen} classNames="hover:opacity-80 px-8 py-3 rounded-md capitalize font-light h-10 w-22 text-xs md:text-sm md:h-12 sm:w-28 md:w-36 lg:w-40 bg-gradient-to-r from-pink-700 to-purple-600 rounded-md text-white font-medium hover:from-pink-500 transition ease-in-out duration-300 hover:to-yellow-500"/>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-2">
            <div>
              <Image
                className="rounded-lg md:w-full"
                src={image1}
                alt="NFT artwork 1"
              />
            </div>
            <div className="mt-8">
              <Image
                className="rounded-lg md:w-full"
                src={image2}
                alt="NFT artwork 2"
              />
            </div>
            <div>
              <Image
                className="-mt-8 rounded-lg md:w-full"
                src={image3}
                alt="NFT artwork 3"
              />
            </div>
            <div>
              <Image
                className="rounded-lg md:w-full"
                src={image4}
                alt="NFT artwork 4"
              />
            </div>
          </div>
        </div>
      </div>
    )
}

"use client";

import { BiSearch } from "react-icons/bi";

export default function Search() {
  return (
  <div className="border-[1px] z-10 border-[#8F9092] w-[250px] sm:w-[480px] py-[3px] bg-gradient-to-b from-[#D8D9DB] via-slate-300 to-[#fff] md:py-2 px-3 rounded-full shadow-xl hover:border-[1px] hover:z-20 hover:shadow-2xl transition cursor-pointer">
      <div className="flex items-center justify-between">
        <input 
          type='text' 
          placeholder='Search' 
          className="w-full outline-none text-xs md:text-sm pl-1 ring-0 focus:ring-0 text-center rounded-full text-[#606060] border-transparent hover:border-[1px] hover:border-rose-500 focus:border-[1px] focus:border-rose-500 transition-colors font-inter placeholder:text-gray-500 placeholder:font-light"
        />
        <div className="p-1 bg-rose-500 rounded-full text-white hover:bg-white hover:text-rose-500 hover:border-rose-500">
          <BiSearch size={15} />
        </div>
      </div>
    </div>
  );
}
'use client'

import React from 'react'

const SkeletonCard = () => {
  return (
    <div 
      className="relative h-[380px] w-full cursor-pointer border border-rose-500/30 bg-gray-900 rounded-lg overflow-hidden 
                 shadow-lg transition-all duration-500 ease-in-out group"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-rose-400/20 via-rose-500/20 to-rose-600/20 opacity-50 animate-pulse"></div>
      <div className="absolute inset-[2px] bg-gray-900 rounded-lg z-10 overflow-hidden">
        <div className="relative h-[380px]">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-700 animate-pulse"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/70 to-transparent opacity-50"></div>
        </div>
        
        <div className="absolute inset-x-0 bottom-0 p-4 space-y-2">
          <div className='flex w-full justify-between'>
            <div className="h-6 w-2/3 bg-gray-800 rounded animate-pulse"></div>
            <div className="h-6 w-1/4 bg-gray-800 rounded animate-pulse"></div>
          </div>
          <div className='flex w-full justify-between'>
            <div className="h-6 w-1/2 bg-gray-800 rounded animate-pulse"></div>
            <div className="h-6 w-1/3 bg-gray-800 rounded animate-pulse"></div>
          </div>
         
        </div>

        <div className="absolute inset-x-0 bottom-0 p-4 space-y-2 opacity-0">
          <div className="h-10 w-full bg-gray-800 rounded animate-pulse"></div>
          <div className="h-10 w-full bg-gray-800 rounded animate-pulse"></div>
        </div>
      </div>
    </div>
  )
}

const CardSkeletonContainer = () => {
  return (
    <>
      {[...Array(8)].map((_, index) => (
        <SkeletonCard key={index} />
      ))}
    </>  
  )
}

export default CardSkeletonContainer


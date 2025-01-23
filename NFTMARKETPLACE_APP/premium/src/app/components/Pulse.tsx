'use client'
import React, { useState } from 'react';

interface PulseProps {
  isAnimating: boolean;
}
const Pulse = ({isAnimating}: PulseProps) => {
 

  return (
   
    <>
      {isAnimating && (
        <div className="cursor-pointer">
          <div className="transform -translate-x-1/2 -translate-y-1/4 w-2 h-2">
              <div className="relative w-full h-full bg-green-400 rounded-full animate-circle"></div>
            <div className="absolute w-[250%] h-[250%] -left-[75%] -top-[75%] rounded-[18px] bg-green-400 
              animate-pulse opacity-animate"></div>
           
          </div>
        </div>
      )}
      
      {!isAnimating && (
        <div 
          className="w-3 h-3 bg-rose-500 rounded-full "></div>
      )}
    </>
   
  );
};

export default Pulse;

// Tailwind config addition remains the same as previous example
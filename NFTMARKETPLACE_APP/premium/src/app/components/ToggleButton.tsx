"use client"

import React, { useState } from 'react';
import useCreateNftModal from "@/app/hooks/useCreateNftModal"

interface ToggleSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void
}


const ToggleSwitch = ({checked, onChange}: ToggleSwitchProps) => {
    const nftModal = useCreateNftModal();

  return (
    <div className="h-full flex items-center ">
      <div className="relative inline-flex">
        <input
          type="checkbox"
          id="toggle"
          checked={checked}
          onChange={() => onChange(!checked)}
          className="hidden"
        />
        <label
          htmlFor="toggle"
          className={`
            block w-[2.2rem] h-[1.2rem]
            rounded-full 
            cursor-pointer
            relative
            ${checked ? 'bg-black' : 'bg-gray-400'}
            transition-colors duration-300
          `}
        >
          <div
            className={`
              absolute top-1 left-1
              w-[12px] h-[12px]
              bg-white rounded-full
              transform transition-transform duration-300
              ${checked ? 'translate-x-4' : 'translate-x-0'}
            `}
          />
        </label>
      </div>
    </div>
  );
};

export default ToggleSwitch;
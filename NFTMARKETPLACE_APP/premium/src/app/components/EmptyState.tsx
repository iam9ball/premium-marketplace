
"use client"
import React from "react";
import Heading from "./Heading";
import Button from "./Button";

interface EmptyStateProps {
  title?: string;
  subtitle?: string;
  showButton?: boolean;
  onClick?: () => void;
  label?: string
}

export default function EmptyState({
  title = "No listing found",
  subtitle = "You have no listing. Try creating one",
  onClick,
  label,
  showButton,
}: EmptyStateProps) {
  return (
    <div className="h-[100vh] w-full flex flex-col gap-2 justify-center items-center">
        <Heading
        title={title}
        subtitle={subtitle}
        center
        titleClassName="text-rose-500 text-sm md:text-base lg:text-lg"
        subtitleClassName="text-rose-500 text-sm md:text-base lg:text-lg"
        />
        <div className="w-40 md:w-48 mt-4">
            {showButton && (
                <Button
                onClick = {() => onClick && onClick()} 
                actionLabel={label}
                classNames="w-[90%] bg-black text-white text-xs md:text-sm py-2 rounded-md"
                />
            )}
        </div>
       
    </div>
  )
}

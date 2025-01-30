'use client';

interface MenuItemProps {
    onClick: () => void
    label: string
}
export default function MenuItem({ 
    onClick, 
    label }: MenuItemProps) {
  return (
    <div
      onClick={onClick}
      className="px-2 py-2 text-[12px] sm:text-xs md:text-sm bg-white  hover:bg-neutral-200 transition font-semibold"
    >
      {label}
    </div>
  );
}

interface CardContainerProps {
  children: React.ReactNode;
  className?: string;
}

export const CardContainer = ({ children, className = "" }: CardContainerProps) => {
  return (
    // <div className="w-full min-h-screen py-6 px-10">
      <div className={`
        grid
        grid-cols-1
        sm:grid-cols-2
        md:grid-cols-3
        lg:grid-cols-4
        gap-x-4
        md:gap-x-3
        gap-y-6
        
        ${className}
      `}>
        {children}
      </div>
    // </div>
  );
};
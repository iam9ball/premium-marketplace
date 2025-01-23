interface CardContainerProps {
  children: React.ReactNode;
  className?: string;
}

export const CardContainer = ({ children, className = "" }: CardContainerProps) => {
  return (
    <div className="w-full min-h-screen py-6 px-10">
      <div className={`
        grid
        grid-cols-1
        sm:grid-cols-2
        md:grid-cols-3
        lg:grid-cols-4
        2xl:grid-cols-4
        gap-6
        mx-auto
        ${className}
      `}>
        {children}
      </div>
    </div>
  );
};
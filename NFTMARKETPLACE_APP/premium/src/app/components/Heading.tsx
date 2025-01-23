"use client";

interface HeadingProps {
    title: string;
    subtitle?: string;
    center?: boolean;
    titleClassName?: string;
    subtitleClassName?: string;
}
 
export default function Heading({ title, subtitle, center, titleClassName, subtitleClassName }: HeadingProps) {
  return <div className={center? "text-center" : "text-start"}>
    <div className={`${titleClassName}`}>
       {title}
    </div>
    <div className={`${subtitleClassName}`}>
        {subtitle}
    </div>
  </div>;
}

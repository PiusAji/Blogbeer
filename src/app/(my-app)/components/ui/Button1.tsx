import React from "react";

interface Button1Props {
  children: React.ReactNode;
  onClick?: () => void; // Make onClick optional
  className?: string; // Make className optional
}

export default function Button1({
  children,
  onClick,
  className,
}: Button1Props) {
  return (
    <button
      onClick={onClick}
      className={`bg-brand-orange transition-all duration-[500ms] ~px-6/8 ~py-3/4 rounded-md font-semibold text-lg text-white group relative overflow-hidden ${className}`}
    >
      <div className="absolute inset-x-0 bottom-0 h-0 bg-orange-300 transition-all duration-[500ms] ease-out group-hover:h-full"></div>
      <p className="relative z-10 group-hover:scale-105 transition-transform duration-[500ms]">
        {children}
      </p>
    </button>
  );
}

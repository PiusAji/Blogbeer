import React from "react";

interface Button2Props {
  children: React.ReactNode;
  onClick?: () => void; // Make onClick optional
  className?: string; // Make className optional
}

export default function Button2({
  children,
  onClick,
  className,
}: Button2Props) {
  return (
    <button
      onClick={onClick}
      className={`bg-white transition-all duration-[500ms] ~px-6/8 ~py-3/4 rounded-sm font-semibold text-lg group relative overflow-hidden ${className}`}
    >
      <div className="absolute inset-x-0 bottom-0 h-0 bg-zinc-900 transition-all text-white duration-[500ms] ease-out group-hover:h-full"></div>
      <p className="relative z-10 group-hover:text-white transition-all duration-[500ms] group-hover:scale-105">
        {children}
      </p>
    </button>
  );
}

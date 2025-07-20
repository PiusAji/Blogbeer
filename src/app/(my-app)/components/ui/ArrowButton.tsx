import React from "react";
import { ChevronRight } from "lucide-react";

export default function ArrowButton({
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className="relative flex items-center h-8 w-16 disabled:opacity-50 disabled:cursor-not-allowed"
      aria-label="Next"
    >
      {/* The line that grows on hover */}
      <span className="absolute left-0 block h-0.5 w-0 bg-black transition-all duration-300 ease-in-out group-hover:w-12" />
      {/* The arrowhead that fades in, positioned absolutely at the end */}
      <span className="absolute right-1 opacity-0 transition-opacity duration-200 ease-in-out delay-200 group-hover:opacity-100">
        <ChevronRight className="w-8 h-8 text-black" />
      </span>
    </button>
  );
}

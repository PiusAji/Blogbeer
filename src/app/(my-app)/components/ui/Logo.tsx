import Link from "next/link";
import React from "react";
import Image from "next/image";

export default function Logo() {
  return (
    <div>
      {/* Logo */}
      <Link
        href="/"
        className="flex items-center bg-orange-500 rounded-full transition-all duration-500 group w-12 hover:w-[104px] px-2"
      >
        <div
          className="h-12 flex items-center justify-center
                  group-hover:justify-start group-hover:w-auto 
                  w-12 transition-all duration-[500ms]"
        >
          <Image
            src="/BlogzyLogo.webp"
            alt="Blogzy Logo"
            width={32}
            height={32}
            className="transition-transform duration-[500ms]"
          />
        </div>
        <span className="text-xl font-extrabold text-zinc-800 overflow-hidden whitespace-nowrap transition-all duration-[500ms] max-w-0 group-hover:max-w-md opacity-0 group-hover:opacity-100">
          logzy
        </span>
      </Link>
    </div>
  );
}

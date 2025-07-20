"use client";

import React, { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import Logo from "./ui/Logo";
import NavLinks from "./ui/NavLink";
import { navLinks as staticNavLinks } from "./ui/NavData"; // Import staticNavLinks

interface NavLinkItem {
  href: string;
  label: string;
  children?: NavLinkItem[];
}

interface HeaderProps {
  navLinks?: NavLinkItem[]; // Define navLinks prop
}

export default function Header({ navLinks = staticNavLinks }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!isMenuOpen || !event.target) return;

      const target = event.target as Element;
      if (!target.closest("header")) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [isMenuOpen]);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isMenuOpen) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isMenuOpen]);

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-white/95 border-b border-zinc-200/50 transition-all duration-500">
      <div className="container mx-auto max-w-6xl ~px-8/0 py-6">
        <div className="flex justify-between items-center">
          <Logo />
          <NavLinks
            links={navLinks}
            className="hidden h-full md:flex items-center space-x-8"
            linkClassName="text-zinc-900 md:text-zinc-600 md:hover:text-zinc-900 transition-all duration-[500ms]"
          />
          <button
            className="md:hidden p-2 rounded-lg hover:bg-zinc-100 transition-all duration-[500ms] cursor-pointer"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? (
              <X className="w-6 h-6 text-zinc-900" />
            ) : (
              <Menu className="w-6 h-6 text-zinc-900" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-[800ms] ease-in-out ${
            isMenuOpen
              ? "max-h-96 opacity-100 mt-4 pt-2 pb-4 border-t border-zinc-800/20"
              : "max-h-0 opacity-0 mt-0 pb-0 border-t border-transparent"
          }`}
        >
          <NavLinks
            links={navLinks}
            direction="vertical"
            linkClassName="text-zinc-900 font-medium py-2"
            getDelay={(index) => `${index * 150}ms`}
            onClick={() => setIsMenuOpen(false)}
            isMenuOpen={isMenuOpen}
          />
        </div>
      </div>
    </header>
  );
}

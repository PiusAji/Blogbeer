import React from "react";
import Logo from "./ui/Logo";
import { navLinks } from "./ui/NavData";

const categories = [
  { href: "/blog/technology", label: "Technology" },
  { href: "/blog/lifestyle", label: "Lifestyle" },
  { href: "/blog/food", label: "Food" },
  { href: "/blog/travel", label: "Travel" },
  { href: "/blog/business", label: "Business" },
  { href: "/blog/game", label: "Game" },
];

export default function Footer() {
  return (
    <footer className="bg-white/95 border-t border-zinc-200/50 backdrop-blur-md py-12">
      <div className="container mx-auto max-w-6xl ~px-8/0">
        <div className="flex flex-col md:flex-row justify-between items-center md:items-start space-y-8 md:space-y-0">
          <div className="flex flex-col items-start mt-4 md:items-center space-y-4 order-last md:order-first">
            <div className="flex items-center justify-center md:justify-start space-x-4">
              <Logo />
              <p className="text-zinc-600 text-sm">
                © {new Date().getFullYear()} Blogzy. All rights reserved.
              </p>
            </div>
          </div>

          <div className="flex flex-col items-center md:items-start space-y-4">
            <h3 className="text-lg font-semibold text-zinc-900">Main Links</h3>
            <ul className="space-y-2 text-center md:text-left">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-zinc-600 hover:text-zinc-900 transition-colors duration-300"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col items-center md:items-start space-y-4">
            <h3 className="text-lg font-semibold text-zinc-900">Categories</h3>
            <ul className="space-y-2 text-center md:text-left">
              {categories.map((category) => (
                <li key={category.href}>
                  <a
                    href={category.href}
                    className="text-zinc-600 hover:text-zinc-900 transition-colors duration-300"
                  >
                    {category.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}

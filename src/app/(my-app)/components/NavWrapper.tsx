import React from "react";
import Header from "./Header";
import { getCategories } from "../lib/api";
import { navLinks as staticNavLinks } from "./ui/NavData";

interface NavLinkItem {
  href: string;
  label: string;
  children?: NavLinkItem[];
}

export default async function NavWrapper() {
  const categories = await getCategories();

  const categoryLinks = categories.map((cat) => ({
    href: `/blog/${cat.slug}`,
    label: cat.name,
  }));

  const dynamicNavLinks: NavLinkItem[] = staticNavLinks.map((link) =>
    link.label === "Blog" // Assuming "Blog" is the placeholder for categories
      ? { ...link, label: "Categories", children: categoryLinks }
      : link
  );

  return <Header navLinks={dynamicNavLinks} />;
}

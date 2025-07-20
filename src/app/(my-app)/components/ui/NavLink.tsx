import Link from "next/link";
import { usePathname } from "next/navigation";
import { navLinks } from "./NavData";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

interface NavLinkItem {
  href: string;
  label: string;
  children?: NavLinkItem[];
}

interface NavLinksProps {
  className?: string;
  linkClassName?: string;
  onClick?: () => void;
  direction?: "horizontal" | "vertical";
  getDelay?: (index: number) => string;
  links?: NavLinkItem[];
  isMenuOpen?: boolean;
}

export default function NavLinks({
  className,
  linkClassName,
  onClick,
  direction = "horizontal",
  getDelay,
  links = navLinks,
  isMenuOpen = true,
}: NavLinksProps) {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [closeTimeout, setCloseTimeout] = useState<NodeJS.Timeout | null>(null);
  const pathname = usePathname();

  const handleDropdownToggle = (label: string) => {
    // Only toggle on mobile (vertical)
    if (direction === "vertical") {
      setOpenDropdown(openDropdown === label ? null : label);
    }
  };

  const handleMouseEnter = (label: string) => {
    // Only on desktop (horizontal)
    if (direction === "horizontal") {
      if (closeTimeout) {
        clearTimeout(closeTimeout);
        setCloseTimeout(null);
      }
      setOpenDropdown(label);
    }
  };

  const handleMouseLeave = () => {
    // Only on desktop (horizontal)
    if (direction === "horizontal") {
      const timeout = setTimeout(() => {
        setOpenDropdown(null);
      }, 150);
      setCloseTimeout(timeout);
    }
  };

  // Check if current path matches link or is a child of the link
  const isActiveLink = (link: NavLinkItem) => {
    if (pathname === link.href) return true;
    if (link.children) {
      return link.children.some((child) => pathname === child.href);
    }
    return false;
  };

  // Base mobile styles without the problematic translate
  const baseMobileClasses =
    direction === "vertical"
      ? "text-lg font-extrabold transform transition-all duration-[800ms]"
      : "";

  // Animation states for mobile menu
  const animationClasses =
    direction === "vertical" && isMenuOpen
      ? "translate-y-0 opacity-100"
      : direction === "vertical"
        ? "-translate-y-4 opacity-0"
        : "";

  return (
    <>
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
      <nav
        className={`flex ${
          direction === "horizontal" ? "space-x-8" : "flex-col space-y-3"
        } ${className}`}
      >
        {links.map((link, index) => (
          <div
            key={link.label}
            className="relative"
            onMouseEnter={() =>
              direction === "horizontal" && handleMouseEnter(link.label)
            }
            onMouseLeave={() =>
              direction === "horizontal" && handleMouseLeave()
            }
          >
            {link.children && link.children.length > 0 ? (
              <>
                <button
                  onClick={() => handleDropdownToggle(link.label)}
                  className={`${linkClassName} flex items-center ${baseMobileClasses} ${animationClasses} relative ${
                    isActiveLink(link)
                      ? "after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-orange-500 after:content-['']"
                      : ""
                  }`}
                  style={
                    getDelay ? { transitionDelay: getDelay(index) } : undefined
                  }
                  onMouseEnter={() => handleMouseEnter(link.label)}
                >
                  {link.label}
                  {direction === "horizontal" && (
                    <ChevronDown
                      className={`ml-1 h-4 w-4 transition-transform duration-200 ${
                        openDropdown === link.label ? "rotate-180" : ""
                      }`}
                    />
                  )}
                </button>
                {(openDropdown === link.label || direction === "vertical") && (
                  <div
                    className={`absolute ${
                      direction === "horizontal"
                        ? "top-full left-0 mt-2"
                        : "relative left-0 ml-4"
                    } ${
                      direction === "horizontal"
                        ? "bg-white shadow-lg rounded-md py-2 w-48 z-10 opacity-0 translate-y-[-10px] animate-fadeInUp"
                        : ""
                    }`}
                    style={{
                      animation:
                        direction === "horizontal" &&
                        openDropdown === link.label
                          ? "fadeInUp 200ms ease-out forwards"
                          : undefined,
                    }}
                    onMouseEnter={() => {
                      if (direction === "horizontal") {
                        if (closeTimeout) {
                          clearTimeout(closeTimeout);
                          setCloseTimeout(null);
                        }
                      }
                    }}
                    onMouseLeave={() =>
                      direction === "horizontal" && handleMouseLeave()
                    }
                  >
                    {link.children.map((childLink) => (
                      <Link
                        key={childLink.href}
                        href={childLink.href}
                        className={`block px-4 py-2 text-gray-800 relative overflow-hidden group ${linkClassName} ${
                          direction === "vertical"
                            ? `pl-1 transform transition-all duration-[800ms] ${
                                isMenuOpen
                                  ? "translate-y-0 opacity-100"
                                  : "-translate-y-4 opacity-0"
                              }`
                            : ""
                        }`}
                        onClick={onClick}
                        style={
                          getDelay
                            ? { transitionDelay: getDelay(index) }
                            : undefined
                        }
                      >
                        <div className="absolute inset-0 md:bg-orange-500 transform scale-x-0 origin-left transition-transform duration-300 ease-out group-hover:scale-x-100"></div>
                        <span
                          className={`relative z-10 transition-colors duration-300 ease-out md:group-hover:text-white ${
                            pathname === childLink.href
                              ? "text-orange-600 font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-orange-500 after:content-['']"
                              : "text-gray-800"
                          }`}
                        >
                          {childLink.label}
                        </span>
                      </Link>
                    ))}
                  </div>
                )}
              </>
            ) : (
              // Regular links with active state styling
              <Link
                href={link.href}
                className={`${linkClassName} ${baseMobileClasses} ${animationClasses} relative ${
                  pathname === link.href
                    ? "after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-orange-500 after:content-[''] font-semibold text-orange-600"
                    : ""
                }`}
                style={
                  getDelay ? { transitionDelay: getDelay(index) } : undefined
                }
                onClick={onClick}
              >
                {link.label}
              </Link>
            )}
          </div>
        ))}
      </nav>
    </>
  );
}

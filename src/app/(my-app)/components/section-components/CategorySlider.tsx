"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { Category, Media } from "../../../../../payload-types";
import Image from "next/image";
import Link from "next/link";

// Create a more specific type for our props
// This guarantees featuredImage is a full Media object, not a string or null
export type ValidCategory = Omit<Category, "featuredImage"> & {
  featuredImage: Media;
};

interface CategorySliderProps {
  categories: ValidCategory[];
}

// Function to get the best available image URL for category slider
const getCategoryImageUrl = (featuredImage: Media) => {
  // 1. First priority: Cloudinary URL (for production)
  if (featuredImage.cloudinaryUrl) {
    return featuredImage.cloudinaryUrl;
  }

  // 2. Second priority: Cloudinary public ID with optimization for category slider
  if (featuredImage.cloudinaryPublicId) {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    if (cloudName) {
      // Category slider images - medium size with good quality
      return `https://res.cloudinary.com/${cloudName}/image/upload/w_400,h_300,c_fill,q_auto:good,f_auto/${featuredImage.cloudinaryPublicId}`;
    }
  }

  // 3. Third priority: Existing thumbnail or original URL
  if (featuredImage.sizes?.thumbnail?.url) {
    return featuredImage.sizes.thumbnail.url;
  }

  // 4. Fallback to original URL
  return featuredImage.url || "/placeholder-image.jpg";
};

export const CategorySlider: React.FC<CategorySliderProps> = ({
  categories,
}) => {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      slidesToScroll: 1,
      align: "center",
      containScroll: "trimSnaps",
    },
    [Autoplay({ playOnInit: true, delay: 3000, stopOnInteraction: false })]
  );

  const [selectedSnap, setSelectedSnap] = useState(0);

  const onScroll = useCallback(() => {
    if (!emblaApi) return;
  }, [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedSnap(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onScroll();
    onSelect();
    emblaApi.on("scroll", onScroll);
    emblaApi.on("reInit", onScroll);
    emblaApi.on("select", onSelect);
  }, [emblaApi, onScroll, onSelect]);

  return (
    <div ref={carouselRef} className="relative z-20 w-full overflow-hidden">
      <div className="w-full overflow-hidden" ref={emblaRef}>
        <div className="flex" style={{ willChange: "transform" }}>
          {categories.map((category, index) => (
            <Link
              href={`/blog/${category.slug}`}
              key={category.id}
              className="relative min-w-0 py-4 mb-4 flex-shrink-0 w-full md:w-1/3 group"
            >
              <div
                className={`h-full w-full overflow-hidden rounded-lg transition-transform border-[6px] borderAbout-glow shadow-lg shadow-zinc-800 duration-200 ease-out ${
                  index === selectedSnap ? "scale-100" : "scale-90"
                }`}
              >
                <Image
                  className="block h-full w-full object-cover"
                  src={getCategoryImageUrl(category.featuredImage)}
                  alt={category.featuredImage.alt || category.name}
                  width={400}
                  height={300}
                />
                <div className="absolute top-0 left-1 rounded-bl-md rounded-br-md py-4 px-4 overflow-hidden border-b border-r border-orange-700 shadow-md">
                  <div className="absolute inset-0 bg-gradient-to-b from-orange-600/90 to-orange-500/80 z-0"></div>
                  <div className="absolute inset-0 bg-zinc-900 h-0 transition-all duration-300 ease-out group-hover:h-full z-1"></div>
                  <span className="relative z-20 text-white text-sm font-semibold tracking-wide drop-shadow-sm [writing-mode:vertical-lr] rotate-180">
                    {category.name}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

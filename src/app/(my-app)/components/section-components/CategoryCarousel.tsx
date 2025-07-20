import React from "react";
import { getCategories } from "../../lib/api";
import { CategorySlider, ValidCategory } from "./CategorySlider";
import { Category, Media } from "../../../../../payload-types";

// A type guard to ensure the featuredImage is a populated Media object
function isMedia(image: string | Media | null | undefined): image is Media {
  return typeof image === "object" && image !== null && "url" in image;
}

export default async function CategoryCarousel() {
  const allCategories: Category[] = await getCategories();

  // Filter categories to only include those with a valid, populated featured image
  const validCategories = allCategories.filter((cat) =>
    isMedia(cat.featuredImage)
  ) as ValidCategory[];

  return <CategorySlider categories={validCategories} />;
}

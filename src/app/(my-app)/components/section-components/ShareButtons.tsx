"use client";
import React from "react";
import { FaWhatsapp, FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";
import { Post } from "../../../../../payload-types";

type ShareButtonsProps = {
  post: Post;
};

export default function ShareButtons({ post }: ShareButtonsProps) {
  const iconStyles =
    "w-4 h-4 text-slate-800 hover:text-orange-500 transition-colors duration-500";

  const getShareUrl = (platform: string) => {
    const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
    const postUrl = `${baseUrl}/blog/${
      post.categories &&
      post.categories.length > 0 &&
      typeof post.categories[0] === "object"
        ? post.categories[0].slug
        : "uncategorized"
    }/${post.slug}`;

    switch (platform) {
      case "whatsapp":
        return `https://wa.me/?text=${encodeURIComponent(
          `Check out this post: ${postUrl}`
        )}`;
      case "facebook":
        return `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
          postUrl
        )}`;
      case "twitter":
        return `https://twitter.com/intent/tweet?url=${encodeURIComponent(
          postUrl
        )}&text=${encodeURIComponent(`Check out this post: ${post.title}`)}`;
      case "instagram":
        return `https://www.instagram.com/`; // Instagram does not have a direct share URL for posts
      default:
        return "#";
    }
  };

  const handleShareClick = (
    e: React.MouseEvent,
    platform: "whatsapp" | "facebook" | "instagram" | "twitter"
  ) => {
    e.preventDefault();
    e.stopPropagation();
    window.open(getShareUrl(platform), "_blank");
  };

  return (
    <div className="flex flex-row gap-3 items-center">
      <div className="text-sm font-semibold text-slate-800">SHARE:</div>
      <button onClick={(e) => handleShareClick(e, "whatsapp")}>
        <FaWhatsapp className={iconStyles} />
      </button>
      <button onClick={(e) => handleShareClick(e, "facebook")}>
        <FaFacebook className={iconStyles} />
      </button>
      <button onClick={(e) => handleShareClick(e, "instagram")}>
        <FaInstagram className={iconStyles} />
      </button>
      <button onClick={(e) => handleShareClick(e, "twitter")}>
        <FaTwitter className={iconStyles} />
      </button>
    </div>
  );
}

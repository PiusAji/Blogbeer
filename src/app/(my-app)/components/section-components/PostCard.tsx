"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { FaWhatsapp, FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";
import { Media, Post } from "../../../../../payload-types";
import ArrowButton from "../ui/ArrowButton";

type PostCardProps = {
  post: Post;
};

function isPopulatedMedia(
  featuredImage: string | Media
): featuredImage is Media {
  return typeof featuredImage === "object" && featuredImage !== null;
}

export default function PostCard({ post }: PostCardProps) {
  const iconStyles =
    "w-4 h-4 text-slate-800 hover:text-orange-500 transition-colors duration-500";

  return (
    <Link
      href={`/blog/${
        post.categories &&
        post.categories.length > 0 &&
        typeof post.categories[0] === "object"
          ? post.categories[0].slug
          : "uncategorized"
      }/${post.slug}`}
      key={post.slug}
      className="group w-full h-full z-20 flex flex-col md:grid md:grid-cols-10 gap-4 bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer hover:translate-x-2 transition-transform duration-[500ms]"
    >
      {/* Left Side: Image (40%) */}
      <div className="relative w-full aspect-video md:aspect-[4/3] md:col-span-4">
        {isPopulatedMedia(post.featuredImage) && (
          <Image
            src={
              post.featuredImage?.sizes?.thumbnail?.url ||
              post.featuredImage?.url ||
              "/placeholder-image.jpg" // Add a fallback placeholder
            }
            alt={post.featuredImage?.alt || post.title}
            fill
            className="w-full h-full object-cover"
            sizes="(max-width: 1024px) 100vw, 40vw"
          />
        )}
      </div>

      {/* Right Side: Text Content (60%) */}
      <div className="md:col-span-6 p-4 flex flex-col justify-center ~gap-2/4">
        <div className="mb-4">
          <div className="flex items-center justify-between">
            <div className="text-base text-orange-500 uppercase font-semibold">
              {post.categories
                .map((cat) => (typeof cat === "object" ? cat.name : ""))
                .join(", ")}
            </div>
            <div className="text-sm text-slate-500">{post.views} Views</div>
          </div>
          <h2 className="text-2xl font-bold text-slate-800">{post.title}</h2>
          <div className="flex flex-row gap-6 items-center">
            <div className="text-base text-slate-500">
              {post.publishedAt
                ? new Intl.DateTimeFormat("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  }).format(new Date(post.publishedAt))
                : null}
            </div>
            <div className="flex flex-row gap-2 text-base font-semibold uppercase">
              <div className="text-slate-800">BY</div>
              <div className="text-orange-500">
                {typeof post.author === "object" && post.author?.name}
              </div>
            </div>
          </div>
        </div>
        <div className="mb-4">
          <p className="text-sm text-slate-600">{post.excerpt}</p>
        </div>
        <div className="flex flex-row justify-between items-center">
          <div className="flex flex-row gap-3 items-center">
            <div className="text-sm font-semibold text-slate-800">SHARE:</div>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                window.open(
                  `https://wa.me/?text=${encodeURIComponent(
                    `Check out this post: ${
                      typeof window !== "undefined"
                        ? window.location.origin
                        : ""
                    }/blog/${
                      post.categories &&
                      post.categories.length > 0 &&
                      typeof post.categories[0] === "object"
                        ? post.categories[0].slug
                        : "uncategorized"
                    }/${post.slug}`
                  )}`,
                  "_blank"
                );
              }}
            >
              <FaWhatsapp className={iconStyles} />
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                window.open(
                  `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                    `${
                      typeof window !== "undefined"
                        ? window.location.origin
                        : ""
                    }/blog/${
                      post.categories &&
                      post.categories.length > 0 &&
                      typeof post.categories[0] === "object"
                        ? post.categories[0].slug
                        : "uncategorized"
                    }/${post.slug}`
                  )}`,
                  "_blank"
                );
              }}
            >
              <FaFacebook className={iconStyles} />
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                window.open(`https://www.instagram.com/`, "_blank");
              }}
            >
              <FaInstagram className={iconStyles} />
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                window.open(
                  `https://twitter.com/intent/tweet?url=${encodeURIComponent(
                    `${
                      typeof window !== "undefined"
                        ? window.location.origin
                        : ""
                    }/blog/${
                      post.categories &&
                      post.categories.length > 0 &&
                      typeof post.categories[0] === "object"
                        ? post.categories[0].slug
                        : "uncategorized"
                    }/${post.slug}`
                  )}&text=${encodeURIComponent(
                    `Check out this post: ${post.title}`
                  )}`,
                  "_blank"
                );
              }}
            >
              <FaTwitter className={iconStyles} />
            </button>
          </div>
          <ArrowButton />
        </div>
      </div>
    </Link>
  );
}

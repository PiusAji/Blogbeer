"use client";
import React from "react";
import Button2 from "../ui/Button2";

type PostFilterButtonsProps = {
  postType: "all" | "recent" | "featured";
  handleFilterChange: (type: "all" | "recent" | "featured") => void;
};

export default function PostFilterButtons({
  postType,
  handleFilterChange,
}: PostFilterButtonsProps) {
  return (
    <div className="flex gap-4 mb-4 z-30 w-full">
      <Button2
        onClick={() => handleFilterChange("all")}
        className={
          postType === "all"
            ? "bg-zinc-900 text-white flex-1"
            : "bg-gray-200 text-zinc-800 flex-1"
        }
      >
        All Posts
      </Button2>
      <Button2
        onClick={() => handleFilterChange("recent")}
        className={
          postType === "recent"
            ? "bg-zinc-900 text-white flex-1"
            : "bg-gray-200 text-zinc-800 flex-1"
        }
      >
        Recent Posts
      </Button2>
      <Button2
        onClick={() => handleFilterChange("featured")}
        className={
          postType === "featured"
            ? "bg-zinc-900 text-white flex-1"
            : "bg-gray-200 text-zinc-800 flex-1"
        }
      >
        Featured Posts
      </Button2>
    </div>
  );
}

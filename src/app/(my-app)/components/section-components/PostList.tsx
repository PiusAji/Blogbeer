"use client";
import React, { useState, useTransition, useEffect } from "react";
import {
  getPostsAction,
  getRecentPostsAction,
  getFeaturedPostsAction,
  getPostsByCategoryAction, // Import new action
} from "../../actions";
import { useRefs } from "../../contexts/RefContext";
import { Post } from "../../../../../payload-types";
import PostCard from "./PostCard";
import PaginationControls from "./PaginationControls";
import PostFilterButtons from "./PostFilterButtons";

interface PaginatedDocs<T = unknown> {
  docs: T[];
  totalDocs: number;
  limit: number;
  totalPages: number;
  page?: number;
  pagingCounter: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  prevPage?: number | null;
  nextPage?: number | null;
}

interface PostListProps {
  initialPosts: PaginatedDocs<Post>;
  showFilters?: boolean;
  searchPlaceholder?: string;
  category?: string; // New optional prop for category
}

export default function PostList({
  initialPosts,
  showFilters = true,
  searchPlaceholder = "Search posts...",
  category, // Destructure category prop
}: PostListProps) {
  const { carouselRef } = useRefs();
  const [posts, setPosts] = useState<Post[]>(initialPosts.docs);
  const [pagination, setPagination] =
    useState<Omit<PaginatedDocs<Post>, "docs">>(initialPosts);
  const [isPending, startTransition] = useTransition();
  const [postType, setPostType] = useState<"all" | "recent" | "featured">(
    "all"
  );
  const [contentVisible, setContentVisible] = useState(true);
  const [searchQuery, setSearchQuery] = useState(""); // New state for search query
  const limit = 5;

  useEffect(() => {
    setPosts(initialPosts.docs);
    setPagination(initialPosts);
    setPostType("all"); // Reset filter when initialPosts change (e.g., from server component)
    setContentVisible(true); // Ensure content is visible on initial load or initialPosts change
  }, [initialPosts]);

  const fetchPosts = async (
    newPage: number,
    type: "all" | "recent" | "featured" = postType,
    query: string = searchQuery
  ) => {
    setContentVisible(false); // Start fade-out
    // Wait for the fade-out transition to complete before fetching new data
    setTimeout(() => {
      startTransition(async () => {
        try {
          let data: PaginatedDocs<Post> | Post[];
          if (type === "recent") {
            data = await getRecentPostsAction(limit);
          } else if (type === "featured") {
            data = await getFeaturedPostsAction(limit);
          } else if (category) {
            data = await getPostsByCategoryAction(category, query); // Use category action if category is present
          } else {
            data = await getPostsAction(newPage, limit, query);
          }

          if (Array.isArray(data)) {
            // For recent and featured posts, construct a PaginatedDocs object
            setPosts(data);
            setPagination({
              totalDocs: data.length,
              limit: data.length,
              totalPages: 1,
              page: 1,
              pagingCounter: 1,
              hasPrevPage: false,
              hasNextPage: false,
              prevPage: null,
              nextPage: null,
            });
          } else {
            setPosts(data.docs);
            setPagination(data);
          }
          // After data is fetched and states are updated, trigger fade-in
          setContentVisible(true);
        } catch (error) {
          console.error("Failed to fetch posts:", error);
        }
      });
    }, 500); // Match this delay to the CSS transition duration
  };

  const handleFilterChange = (type: "all" | "recent" | "featured") => {
    setPostType(type);
    fetchPosts(1, type, searchQuery); // Always fetch first page when changing filter, include search query
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    fetchPosts(1, postType, e.target.value); // Fetch posts with new search query
  };

  const handlePrevPage = () => {
    if (isPending || !pagination.hasPrevPage) return;
    fetchPosts(pagination.prevPage!, postType, searchQuery);
  };

  const handleNextPage = () => {
    if (isPending || !pagination.hasNextPage) return;
    fetchPosts(pagination.nextPage!, postType, searchQuery);
  };

  // Use contentVisible for the opacity class
  const opacityClass = contentVisible ? "opacity-100" : "opacity-0";

  return (
    <div
      ref={carouselRef}
      className="flex flex-col justify-center items-center"
    >
      {showFilters && (
        <PostFilterButtons
          postType={postType}
          handleFilterChange={handleFilterChange}
        />
      )}
      <input
        type="text"
        placeholder={searchPlaceholder}
        value={searchQuery}
        onChange={handleSearchChange}
        className="w-full p-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 z-30"
      />
      {/* This container will handle the fade transition */}
      <div
        className={`w-full flex flex-col gap-4 transition-opacity duration-[800ms] ${opacityClass}`}
      >
        {posts.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>

      <PaginationControls
        pagination={pagination}
        isPending={isPending}
        handlePrevPage={handlePrevPage}
        handleNextPage={handleNextPage}
      />
    </div>
  );
}

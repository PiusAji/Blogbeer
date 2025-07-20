import React from "react";
import CategoryCarousel from "./components/section-components/CategoryCarousel";
import { Bounded } from "./components/Bounded";

import PostList from "./components/section-components/PostList";
import { getPostsAction } from "./actions";

export default async function PostSection() {
  return (
    <Bounded as="section" className="relative py-20  bg-zinc-800 bg-texture">
      <div
        className="absolute top-0 left-0 w-full h-44 z-10"
        style={{
          background: `
    radial-gradient(ellipse 80% 50% at 20% 0%, rgba(228,228,231,0.3) 0%, transparent 50%),
    radial-gradient(ellipse 60% 40% at 80% 0%, rgba(228,228,231,0.4) 0%, transparent 60%),
    radial-gradient(ellipse 100% 80% at 50% 0%, rgba(228,228,231,0.2) 0%, transparent 70%),
    linear-gradient(to top, transparent 0%, rgba(228,228,231,0.02) 20%, rgba(228,228,231,0.05) 30%, rgba(228,228,231,0.1) 40%, rgba(228,228,231,0.2) 50%, rgba(228,228,231,0.35) 60%, rgba(228,228,231,0.55) 70%, rgba(228,228,231,0.75) 80%, rgba(228,228,231,0.9) 90%, rgb(228,228,231) 100%)
  `,
        }}
      ></div>
      {/* Category Carousel */}
      <CategoryCarousel />
      {/* Fetch initial posts for the PostList component */}

      <PostList
        initialPosts={await getPostsAction(1, 5)}
        searchPlaceholder="Search posts..."
      />
    </Bounded>
  );
}

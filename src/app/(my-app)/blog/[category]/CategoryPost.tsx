import React from "react";

import PostList from "../../components/section-components/PostList";
import { Bounded } from "../../components/Bounded";
import { getPostsByCategoryAction } from "../../actions";

export default async function CategoryPost({ category }: { category: string }) {
  try {
    const categoryPosts = await getPostsByCategoryAction(category);
    return (
      <Bounded className="bg-white">
        <PostList
          initialPosts={categoryPosts}
          showFilters={false}
          searchPlaceholder={`Search ${category} posts...`}
          category={category} // Pass the category prop
        />
      </Bounded>
    );
  } catch (error) {
    console.error("Error fetching hero data:", error);

    // Fallback content or error state
    return (
      <div className="bg-white min-h-screen flex items-center justify-center">
        <div className="text-center text-slate-800">
          <h1 className="text-4xl font-bold mb-4">Welcome</h1>
          <p className="text-lg mb-8 text-slate-600">
            Sorry, we are having trouble loading the content.
          </p>
          <button className="bg-violet-500 text-white px-6 py-3 rounded-lg font-semibold">
            Try Again
          </button>
        </div>
      </div>
    );
  }
}

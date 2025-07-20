import { Bounded } from "@/app/(my-app)/components/Bounded";
import { getPostBySlug } from "@/app/(my-app)/lib/api";
import React from "react";
import PostHero from "./PostHero";
import PostAbout from "./PostAbout";

export default async function SlugPost({ slugstring }: { slugstring: string }) {
  const slugpost = await getPostBySlug(slugstring.trim());

  if (!slugpost) {
    return (
      <div className="bg-white min-h-screen flex items-center justify-center">
        <div className="text-center text-zinc-800">
          <h1 className="text-4xl font-bold mb-4">Post Not Found</h1>
          <p className="text-lg mb-8 text-zinc-600">
            Sorry, we could not find the post you were looking for.
          </p>
        </div>
      </div>
    );
  }

  try {
    return (
      <section>
        <PostHero post={slugpost} />
        <Bounded className="bg-white bg-texture-mirror relative">
          <PostAbout post={slugpost} />
        </Bounded>
      </section>
    );
  } catch (error) {
    console.error("Error fetching hero data:", error);

    // Fallback content or error state
    return (
      <div className="bg-white min-h-screen flex items-center justify-center">
        <div className="text-center text-zinc-800">
          <h1 className="text-4xl font-bold mb-4">Welcome</h1>
          <p className="text-lg mb-8 text-zinc-600">
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

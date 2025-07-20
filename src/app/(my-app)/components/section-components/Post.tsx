import React from "react";
import PostList from "./PostList";
import { getPosts } from "../../lib/api"; // Still need getPosts for the initial load

export default async function Posts() {
  const initialPosts = await getPosts(1, 5); // Fetch initial posts for PostList
  return <PostList initialPosts={initialPosts} />;
}

"use server";

import {
  getPosts,
  getRecentPosts,
  getFeaturedPosts,
  getPostsByCategory,
} from "./lib/api";

export async function getPostsAction(
  page: number,
  limit: number,
  query: string = ""
) {
  const data = await getPosts(page, limit, query);
  return data;
}

export async function getPostsByCategoryAction(
  categorySlug: string,
  query: string = ""
) {
  const data = await getPostsByCategory(categorySlug, query);
  return data;
}

export async function getRecentPostsAction(limit: number, query: string = "") {
  const data = await getRecentPosts(limit, "", query); // excludeSlug is not needed for this context, so passing empty string
  return data;
}

export async function getFeaturedPostsAction(limit: number) {
  const data = await getFeaturedPosts(limit);
  return data;
}

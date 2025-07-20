// lib/api.ts - Simple API utility for connecting to your Payload server
import { unstable_cache } from "next/cache";
import { getCachedPayload } from "../../../payload";
import type { Where } from "payload";

// Helper to get Payload client
export const getPayloadClient = async () => {
  return await getCachedPayload();
};

// Homepage data
export const getHomepageData = unstable_cache(
  async () => {
    const payload = await getPayloadClient();
    return await payload.findGlobal({
      slug: "homepage",
      depth: 3,
    });
  },
  ["homepage-data"],
  {
    revalidate: 3600,
    tags: ["homepage"],
  }
);

// Site settings
export const getSiteSettings = async () => {
  const payload = await getPayloadClient();
  return await payload.findGlobal({
    slug: "siteSettings",
    depth: 1,
  });
};

// All posts
export const getPosts = async (page = 1, limit = 10, query: string = "") => {
  const payload = await getPayloadClient();
  const where: Where = query
    ? {
        or: [
          { title: { contains: query } },
          { content: { contains: query } },
          { categories: { contains: query } },
        ],
      }
    : {};
  return await payload.find({
    collection: "posts",
    depth: 2,
    limit,
    page,
    sort: "-publishedAt",
    where,
  });
};

// Single post by slug
export const getPostBySlug = async (slug: string) => {
  const payload = await getPayloadClient();
  const response = await payload.find({
    collection: "posts",
    where: {
      slug: {
        equals: slug,
      },
    },
    depth: 2,
    limit: 1,
  });
  return response.docs[0] || null;
};

// All categories
export const getCategories = async () => {
  const payload = await getPayloadClient();
  const response = await payload.find({
    collection: "categories",
    depth: 1,
  });
  return response.docs || [];
};

// Posts by category
export const getPostsByCategory = async (
  categorySlug: string,
  query: string = ""
) => {
  const payload = await getPayloadClient();
  const where: Where = {
    and: [
      {
        "categories.slug": {
          equals: categorySlug,
        },
      },
    ],
  };

  if (query) {
    where.and?.push({
      or: [{ title: { contains: query } }, { content: { contains: query } }],
    });
  }

  return await payload.find({
    collection: "posts",
    where,
    depth: 2,
  });
};

// Recent posts
export const getRecentPosts = async (
  limit = 4,
  excludeSlug: string,
  query: string = ""
) => {
  const payload = await getPayloadClient();
  const where: Where = {
    slug: {
      not_equals: excludeSlug,
    },
  };

  if (query) {
    where.or = [
      { title: { contains: query } },
      { content: { contains: query } },
    ];
  }

  const response = await payload.find({
    collection: "posts",
    where,
    depth: 2,
    limit,
    sort: "-publishedAt",
  });
  return response.docs || [];
};

// Featured posts
export const getFeaturedPosts = async (limit = 3) => {
  const payload = await getPayloadClient();
  const response = await payload.find({
    collection: "posts",
    where: {
      featured: {
        equals: true,
      },
    },
    depth: 2,
    limit,
    sort: "-publishedAt", // Add sorting for consistency
  });
  return response.docs || []; // Return docs directly
};

// Get media by ID
export const getMediaById = async (id: string) => {
  const payload = await getPayloadClient();
  return await payload.findByID({
    collection: "media",
    id,
  });
};

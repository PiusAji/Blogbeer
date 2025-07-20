// app/(my-app)/blog/[category]/[slug]/page.tsx
import React from "react";
import { RefProvider } from "../../../contexts/RefContext";
import SlugPost from "./SlugPost";

export default async function Page({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}) {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);

  return (
    <main className="">
      <RefProvider>
        <SlugPost slugstring={decodedSlug} />
      </RefProvider>
    </main>
  );
}

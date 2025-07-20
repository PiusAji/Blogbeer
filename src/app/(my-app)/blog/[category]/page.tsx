// app/(my-app)/blog/[category]/page.tsx
import React from "react";
import CategoryPost from "./CategoryPost";
import { RefProvider } from "../../contexts/RefContext";

export default async function Page({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;

  return (
    <main className="">
      <RefProvider>
        <CategoryPost category={category} />
      </RefProvider>
    </main>
  );
}

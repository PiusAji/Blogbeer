"use client";
import React from "react";
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

import { Post } from "../../../../../payload-types";

type PaginationControlsProps = {
  pagination: Omit<PaginatedDocs<Post>, "docs">;
  isPending: boolean;
  handlePrevPage: () => void;
  handleNextPage: () => void;
};

export default function PaginationControls({
  pagination,
  isPending,
  handlePrevPage,
  handleNextPage,
}: PaginationControlsProps) {
  return (
    <div className="flex justify-center items-center gap-4 mt-8 z-20">
      <button
        onClick={handlePrevPage}
        disabled={!pagination.hasPrevPage || isPending}
        className="bg-orange-500 text-white px-4 py-2 rounded-lg disabled:bg-slate-400"
      >
        Previous
      </button>
      <span className="text-slate-200">
        Page {pagination.page} of {pagination.totalPages}
      </span>
      <button
        onClick={handleNextPage}
        disabled={!pagination.hasNextPage || isPending}
        className="bg-orange-500 text-white px-4 py-2 rounded-lg disabled:bg-slate-400"
      >
        Next
      </button>
    </div>
  );
}

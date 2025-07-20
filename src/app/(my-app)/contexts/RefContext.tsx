"use client";
import React, { createContext, useContext, useRef, ReactNode } from "react";

interface RefContextType {
  containerRef: React.RefObject<HTMLDivElement | null>;
  carouselRef: React.RefObject<HTMLDivElement | null>;
}

const RefContext = createContext<RefContextType | null>(null);

export function RefProvider({ children }: { children: ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);

  return (
    <RefContext.Provider value={{ containerRef, carouselRef }}>
      {children}
    </RefContext.Provider>
  );
}

export function useRefs() {
  const context = useContext(RefContext);
  if (!context) {
    throw new Error("useRefs must be used within RefProvider");
  }
  return context;
}

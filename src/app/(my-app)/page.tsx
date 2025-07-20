import React from "react";
import Hero from "./Hero";
import PostSection from "./PostSection";
import About from "./About";
import { RefProvider } from "./contexts/RefContext";

export default function Page() {
  return (
    <main className="">
      <Hero />
      <RefProvider>
        <About />
        <PostSection />
      </RefProvider>
    </main>
  );
}

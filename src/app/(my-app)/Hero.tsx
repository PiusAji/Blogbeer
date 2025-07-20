// src/app/(my-app)/Hero.tsx
import { getHomepageData } from "./lib/api";
import HeroContent from "./components/section-components/HeroData";
import { Homepage, Media } from "../../../payload-types";

export default async function Hero() {
  try {
    const data: Homepage = await getHomepageData();
    const heroData = data.hero;

    // The video is already populated by the `depth=3` query
    if (heroData && typeof heroData.video !== "string") {
      return (
        <HeroContent
          heroData={heroData as Homepage["hero"] & { video: Media }}
        />
      );
    }

    // Handle case where video is not populated (should not happen with depth=3)
    return (
      <div className="bg-red-500 text-white p-4">
        Error: Hero video not found or not populated.
      </div>
    );
  } catch (error) {
    console.error("Error fetching hero data:", error);

    // Fallback content or error state
    return (
      <div className="bg-slate-900 min-h-screen flex items-center justify-center">
        <div className="text-center text-slate-50">
          <h1 className="text-4xl font-bold mb-4">Welcome</h1>
          <p className="text-lg mb-8 text-slate-300">
            Sorry, we are having trouble loading the content.
          </p>
          <button className="bg-slate-50 text-slate-900 px-6 py-3 rounded-lg font-semibold">
            Try Again
          </button>
        </div>
      </div>
    );
  }
}

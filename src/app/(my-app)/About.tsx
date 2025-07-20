import React from "react";
import { getHomepageData } from "./lib/api";
import BlogAboutSection from "./components/section-components/AboutData";
import { Homepage } from "../../../payload-types";

export default async function About() {
  try {
    const data: Homepage = await getHomepageData();

    // 2. Isolate the 'about' data from it.
    const aboutSectionData = data.about;
    return <BlogAboutSection aboutData={aboutSectionData} />;
  } catch (error) {
    console.error("Error fetching hero data:", error);

    // Fallback content or error state
    return (
      <div className="bg-slate-50 min-h-screen flex items-center justify-center">
        <div className="text-center text-slate-900">
          <h1 className="text-4xl font-bold mb-4">Welcome</h1>
          <p className="text-lg mb-8 text-slate-600">
            Sorry, we are having trouble loading the content.
          </p>
          <button className="bg-slate-900 text-slate-50 px-6 py-3 rounded-lg font-semibold">
            Try Again
          </button>
        </div>
      </div>
    );
  }
}

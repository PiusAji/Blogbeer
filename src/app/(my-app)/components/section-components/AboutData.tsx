"use client";

import React, { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Bounded } from "../Bounded";
import { FloatingTextBox } from "../../components/FloatingTextBox";
import { use3DModel } from "../../hooks/use3DModel";
import { useRefs } from "../../contexts/RefContext";

import { Homepage } from "../../../../../payload-types";

interface AboutProps {
  aboutData: Homepage["about"];
}

const BlogAboutSection = ({ aboutData }: AboutProps) => {
  const { containerRef, carouselRef } = useRefs();

  // Use the custom hook for 3D model
  const { mountRef } = use3DModel({
    modelPath: "/Blogzy.glb",
    containerRef,
    carouselRef,
    scale: 10,
    ambientLightIntensity: 3,
    pointLightIntensity: 7,
  });

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    // Cleanup on unmount
    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <>
      {/* 3D Model Container - positioned behind the Hero section initially */}
      <div
        ref={mountRef}
        style={{
          position: "fixed", // Changed from sticky to fixed
          top: 0,
          left: 0,
          width: "100%",
          height: "100vh",
          zIndex: 20, // Behind everything initially
          pointerEvents: "none", // Prevent interaction issues
        }}
      />

      {/* Content Section */}
      <Bounded className="bg-zinc-200 bg-texture-mirror relative">
        {/* Top Gradient */}
        <div
          className="absolute top-0 left-0 w-full h-80 z-10"
          style={{
            background: `
      radial-gradient(ellipse 80% 50% at 20% 0%, rgba(255,255,255,0.3) 0%, transparent 50%),
      radial-gradient(ellipse 60% 40% at 80% 0%, rgba(255,255,255,0.4) 0%, transparent 60%),
      radial-gradient(ellipse 100% 80% at 50% 0%, rgba(255,255,255,0.2) 0%, transparent 70%),
      linear-gradient(to top, transparent 0%, rgba(255,255,255,0.02) 20%, rgba(255,255,255,0.05) 30%, rgba(255,255,255,0.1) 40%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0.35) 60%, rgba(255,255,255,0.55) 70%, rgba(255,255,255,0.75) 80%, rgba(255,255,255,0.9) 90%, white 100%)
    `,
          }}
        />

        <div
          ref={containerRef}
          className="relative min-h-screen py-20 px-4 z-30"
        >
          {/* Header */}
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-zinc-800 mb-4 ">
              {aboutData.title}
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-zinc-800 to-brand-orange mx-auto rounded-full"></div>
          </div>

          {/* Floating Text Boxes */}
          <div className="mx-auto space-y-32">
            {aboutData.floatingBoxes?.map((item, index) => (
              <FloatingTextBox
                key={item.id}
                title={item.title}
                content={item.description ?? ""}
                isLeft={index % 2 === 0}
              />
            ))}
          </div>
        </div>

        {/* Bottom Gradient */}
        <div
          className="absolute bottom-0 left-0 w-full h-80 z-10"
          style={{
            background: `
    radial-gradient(ellipse 80% 50% at 20% 100%, rgba(228,228,231,0.3) 0%, transparent 50%),
    radial-gradient(ellipse 60% 40% at 80% 100%, rgba(228,228,231,0.4) 0%, transparent 60%),
    radial-gradient(ellipse 100% 80% at 50% 100%, rgba(228,228,231,0.2) 0%, transparent 70%),
    linear-gradient(to bottom, transparent 0%, rgba(228,228,231,0.02) 20%, rgba(228,228,231,0.05) 30%, rgba(228,228,231,0.1) 40%, rgba(228,228,231,0.2) 50%, rgba(228,228,231,0.35) 60%, rgba(228,228,231,0.55) 70%, rgba(228,228,231,0.75) 80%, rgba(228,228,231,0.9) 90%, rgb(228,228,231) 100%)
  `,
          }}
        />
      </Bounded>
    </>
  );
};

export default BlogAboutSection;

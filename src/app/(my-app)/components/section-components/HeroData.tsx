"use client";
import React, { useEffect, useRef, useState } from "react";
import { Bounded } from "../Bounded";
import Button1 from "../ui/Button1";

import { Homepage, Media } from "../../../../../payload-types";

interface HeroProps {
  heroData: Homepage["hero"] & { video: Media };
}

export default function HeroContent({ heroData }: HeroProps) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const heroRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [shouldLoadVideo, setShouldLoadVideo] = useState(false);

  useEffect(() => {
    // Load video after page is ready
    const timer = setTimeout(() => {
      setShouldLoadVideo(true);
    }, 500); // Wait 2 seconds after page load

    return () => clearTimeout(timer);
  }, []);

  // Simple function to get hero video URL
  const getHeroVideoUrl = (videoMedia: Media | null | undefined) => {
    if (!videoMedia) return null;

    // 1. First priority: Cloudinary URL (for production)
    if (videoMedia.cloudinaryUrl) {
      return videoMedia.cloudinaryUrl;
    }

    // 2. Second priority: Cloudinary public ID with basic optimization
    if (videoMedia.cloudinaryPublicId) {
      const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
      if (cloudName) {
        return `https://res.cloudinary.com/${cloudName}/video/upload/q_auto,f_auto/${videoMedia.cloudinaryPublicId}`;
      }
    }

    // 3. Third priority: Original local URL
    if (videoMedia.url) {
      return getFullMediaUrl(videoMedia.url);
    }

    return null;
  };

  // Keep your existing function for backward compatibility
  const getFullMediaUrl = (url: string) => {
    const PAYLOAD_SERVER_URL =
      process.env.NEXT_PUBLIC_PAYLOAD_URL || "http://localhost:3000";
    const relativeUrl = url.startsWith("/") ? url : `/${url}`;
    return `${PAYLOAD_SERVER_URL}${relativeUrl}`;
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!heroRef.current) return;

      const rect = heroRef.current.getBoundingClientRect();
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      // Calculate mouse position relative to center
      const x = e.clientX - rect.left - centerX;
      const y = e.clientY - rect.top - centerY;

      // Normalize to a smaller range for subtle movement
      const normalizedX = (x / centerX) * 15; // Adjust multiplier for intensity
      const normalizedY = (y / centerY) * 15;

      setMousePos({ x: normalizedX, y: normalizedY });
    };

    const handleMouseEnter = () => setIsHovered(true);
    const handleMouseLeave = () => {
      setIsHovered(false);
      setMousePos({ x: 0, y: 0 }); // Reset to center
    };

    const hero = heroRef.current;
    if (hero) {
      hero.addEventListener("mousemove", handleMouseMove);
      hero.addEventListener("mouseenter", handleMouseEnter);
      hero.addEventListener("mouseleave", handleMouseLeave);
    }

    return () => {
      if (hero) {
        hero.removeEventListener("mousemove", handleMouseMove);
        hero.removeEventListener("mouseenter", handleMouseEnter);
        hero.removeEventListener("mouseleave", handleMouseLeave);
      }
    };
  }, []);

  return (
    <Bounded
      as="section"
      ref={heroRef}
      className="bg-zinc-800 relative min-h-screen overflow-hidden bg-texture flex items-center z-40"
    >
      <div className="grid lg:grid-cols-2 gap-14 items-center h-full">
        {/* video box */}
        <div className="order-2 lg:order-1 hidden lg:block">
          <div
            className="aspect-video rounded-lg overflow-hidden border-[6px] shadow-xl shadow-orange-500 video-glow border-cyan-50 backdrop-blur-sm relative"
            style={{
              transform: `translate(${mousePos.x * 0.5}px, ${
                mousePos.y * 0.5
              }px)`,
              transition: isHovered
                ? "transform 0.1s ease-out"
                : "transform 0.3s ease-out",
            }}
          >
            {shouldLoadVideo ? (
              <video
                className="w-full h-full object-cover"
                autoPlay
                loop
                muted
                playsInline
                preload="none"
              >
                {heroData?.video?.url && getHeroVideoUrl(heroData.video) && (
                  <source
                    src={getHeroVideoUrl(heroData.video)!} // Non-null assertion since we just checked
                    type={heroData.video.mimeType || "video/mp4"}
                  />
                )}
                {/* Fallback for browsers that don't support video */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 bg-brand-blue/30 rounded-full flex items-center justify-center shadow-lg shadow-brand-blue">
                      <div className="w-0 h-0 border-l-[20px] border-l-white border-y-[12px] border-y-transparent ml-2"></div>
                    </div>
                  </div>
                </div>
              </video>
            ) : (
              <div className="bg-gray-800 w-full h-full flex items-center justify-center">
                <p className="text-white">Loading video...</p>
              </div>
            )}
          </div>
        </div>

        {/* text box */}
        <div
          className="order-1 lg:order-2 text-center lg:text-left"
          style={{
            transform: `translate(${mousePos.x * -0.3}px, ${
              mousePos.y * -0.3
            }px)`,
            transition: isHovered
              ? "transform 0.1s ease-out"
              : "transform 0.3s ease-out",
          }}
        >
          <h1 className="~text-4xl/6xl font-bold text-white ~mb-4/6">
            {heroData?.title}
          </h1>
          <p className="~text-lg/xl text-zinc-300 ~mb-6/8">
            {heroData?.description}
          </p>
          <Button1>{heroData?.ctaButton?.text}</Button1>
        </div>
      </div>
      <div
        className="absolute bottom-0 left-0 w-full h-32 z-0"
        style={{
          background: `
      radial-gradient(ellipse 80% 50% at 20% 100%, rgba(255,255,255,0.3) 0%, transparent 50%),
      radial-gradient(ellipse 60% 40% at 80% 100%, rgba(255,255,255,0.4) 0%, transparent 60%),
      radial-gradient(ellipse 100% 80% at 50% 100%, rgba(255,255,255,0.2) 0%, transparent 70%),
      linear-gradient(to bottom, transparent 0%, rgba(255,255,255,0.02) 20%, rgba(255,255,255,0.05) 30%, rgba(255,255,255,0.1) 40%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0.35) 60%, rgba(255,255,255,0.55) 70%, rgba(255,255,255,0.75) 80%, rgba(255,255,255,0.9) 90%, white 100%)
    `,
        }}
      />
    </Bounded>
  );
}

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

interface FloatingTextBoxProps {
  title: string;
  content?: string;
  isLeft: boolean;
}

export const FloatingTextBox: React.FC<FloatingTextBoxProps> = ({
  title,
  content,
  isLeft,
}) => {
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const target = boxRef.current;
    if (!target) return;

    // Set the initial off-screen position. The element is invisible due to `opacity-0`
    gsap.set(target, { y: 60, x: isLeft ? -100 : 100 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: target,
        start: "top 80%",
        once: true,
        markers: false,
      },
    });

    // 1. Fade in the element while it's still off-screen.
    //    This gives the browser time to compute the backdrop-blur before movement.
    tl.to(target, {
      opacity: 1,
      duration: 0.1, // Very short fade, just enough to trigger the render
      ease: "none",
    })
      // 2. Move the now-visible element into its final position.
      .to(
        target,
        {
          y: 0,
          x: 0,
          duration: 1.5,
          ease: "power3.out",
        },
        "+=0.05" // Start shortly after the fade-in completes
      );

    return () => {
      if (tl.scrollTrigger) {
        tl.scrollTrigger.kill();
      }
      tl.kill();
    };
  }, [isLeft]);

  return (
    <div
      ref={boxRef} // This outer div is the animation target
      className={`flex ${
        isLeft ? "justify-start" : "justify-end"
      } w-full opacity-0`}
    >
      {/* This inner div contains the blur and is NOT animated directly */}
      <div className="max-w-2xl w-full">
        <div className="rounded-lg overflow-hidden border-[6px] shadow-xl shadow-zinc-500 borderAbout-glow backdrop-blur-lg bg-white/70 p-8">
          <h3 className="text-2xl font-bold text-zinc-800 mb-4 flex items-center gap-3">
            <span className="w-2 h-2 bg-gradient-to-r from-zinc-600 to-brand-orange rounded-full animate-pulse"></span>
            {title}
          </h3>
          <p className="text-zinc-600 leading-relaxed text-lg">{content}</p>

          {/* Decorative Elements */}
          <div className="mt-6 flex items-center gap-2">
            <div className="flex gap-1">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="w-2 h-2 rounded-full bg-gradient-to-r from-zinc-600 to-brand-orange"
                  style={{
                    animationDelay: `${i * 0.2}s`,
                    animation: "pulse 2s infinite",
                  }}
                />
              ))}
            </div>
            <div className="flex-1 h-px bg-gradient-to-r from-zinc-800 to-brand-orange opacity-50"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

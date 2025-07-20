import Image from "next/image";
import { Media, Post } from "../../../../../../payload-types";

interface PostHeroProps {
  post: Post;
}

function isPopulatedMedia(
  featuredImage: string | Media
): featuredImage is Media {
  return typeof featuredImage === "object" && featuredImage !== null;
}

export default function PostHero({ post }: PostHeroProps) {
  return (
    <section className="relative w-full h-full">
      <div className="relative min-h-screen overflow-hidden z-10">
        <div className="absolute inset-0 bg-texture z-0"></div>

        {isPopulatedMedia(post.featuredImage) && (
          <Image
            src={post.featuredImage.url || "/placeholder-image.jpg"}
            alt={post.featuredImage.alt || post.title}
            fill
            className="object-cover opacity-90 mix-blend-multiply"
            priority
          />
        )}
        <div className="absolute inset-0 bg-black/40 z-20"></div>

        <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
          <h1 className="font-bold text-4xl text-white text-center drop-shadow-lg">
            {post.title}
          </h1>
        </div>
      </div>
      <div
        className="absolute bottom-0 left-0 w-full h-60 z-20"
        style={{
          background: `
      radial-gradient(ellipse 80% 50% at 20% 100%, rgba(255,255,255,0.3) 0%, transparent 50%),
      radial-gradient(ellipse 60% 40% at 80% 100%, rgba(255,255,255,0.4) 0%, transparent 60%),
      radial-gradient(ellipse 100% 80% at 50% 100%, rgba(255,255,255,0.2) 0%, transparent 70%),
      linear-gradient(to bottom, transparent 0%, rgba(255,255,255,0.02) 20%, rgba(255,255,255,0.05) 30%, rgba(255,255,255,0.1) 40%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0.35) 60%, rgba(255,255,255,0.55) 70%, rgba(255,255,255,0.75) 80%, rgba(255,255,255,0.9) 90%, white 100%)
    `,
        }}
      />
    </section>
  );
}

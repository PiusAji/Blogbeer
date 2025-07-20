import { Post } from "../../../../../../payload-types";
import { getRecentPosts } from "../../../lib/api";
import Image from "next/image";
import Link from "next/link";

interface PostAboutProps {
  post: Post;
}

function getPostContent(content: Post["content"]): string {
  if (!content?.root?.children) return "No content available";

  for (const child of content.root.children) {
    if (child && typeof child === "object" && "text" in child) {
      const text = String(child.text).trim();
      if (text && text.length > 0) {
        return text;
      }
    }

    if (
      child &&
      typeof child === "object" &&
      "children" in child &&
      Array.isArray(child.children)
    ) {
      for (const grandChild of child.children) {
        if (
          grandChild &&
          typeof grandChild === "object" &&
          "text" in grandChild
        ) {
          const text = String(grandChild.text).trim();
          if (text && text.length > 0) {
            return text;
          }
        }
      }
    }
  }

  return "No content available";
}

export default async function PostAbout({ post }: PostAboutProps) {
  const recentPosts = await getRecentPosts(4, post.slug);

  return (
    <section>
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
      <div className="flex flex-col md:grid md:grid-cols-10 gap-24">
        <div className="col-span-6 ~p-4/6 items-center w-full h-full rounded-lg bg-white/50 shadow-lg backdrop-blur-sm z-20">
          <p className="text-lg text-zinc-800">
            {getPostContent(post.content)}
          </p>
        </div>
        <div className="col-span-4 flex flex-col items-center justify-center p-4 w-full h-full z-20 rounded-lg bg-white/50 shadow-lg backdrop-blur-sm">
          <div className="flex flex-col items-center justify-center ~gap-2/4">
            <h3 className="text-xl font-bold mb-4 text-zinc-800">
              Recent Posts
            </h3>
            <div className="flex flex-col gap-4">
              {recentPosts.map((recentPost) => (
                <Link
                  href={`/blog/${
                    typeof recentPost.categories[0] === "object"
                      ? recentPost.categories[0].slug
                      : ""
                  }/${recentPost.slug}`}
                  key={recentPost.id}
                  className="flex items-center gap-4 group border-b border-zinc-200 pb-4 last:border-b-0 last:pb-0"
                >
                  <div className="w-24 h-24 relative">
                    {typeof recentPost.featuredImage === "object" && (
                      <Image
                        src={
                          recentPost.featuredImage?.sizes?.thumbnail?.url ||
                          recentPost.featuredImage?.url ||
                          "/placeholder.jpg"
                        }
                        alt={recentPost.featuredImage?.alt || recentPost.title}
                        fill
                        className="object-cover rounded-md"
                      />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-zinc-800 group-hover:text-orange-500 transition-colors duration-300">
                      {recentPost.title}
                    </p>
                    <p className="text-xs text-zinc-500">
                      {recentPost.publishedAt
                        ? new Date(recentPost.publishedAt).toLocaleDateString()
                        : "Date not available"}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Clock, User, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getPublishedPosts, BlogPostData } from "@/lib/blogService";
import { format } from "date-fns";
import { useReveal } from "@/hooks/useReveal";

export default function Blog() {
  const [posts, setPosts] = useState<BlogPostData[]>([]);
  const [loading, setLoading] = useState(true);

  useReveal();

  useEffect(() => {
    getPublishedPosts()
      .then((data) => setPosts([...data].sort((a, b) => (b.createdAt?.toMillis?.() ?? 0) - (a.createdAt?.toMillis?.() ?? 0))))
      .catch((err) => console.error("Failed to load posts:", err))
      .finally(() => setLoading(false));
  }, []);

  const categories = Array.from(new Set(posts.map((p) => p.category))).filter(Boolean);

  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        <div className="mb-10 reveal visible">
          <h1 className="text-3xl font-extrabold md:text-4xl">Blog</h1>
          <p className="mt-2 text-muted-foreground">Sneaker culture, deal alerts, style guides, and AI insights.</p>
        </div>

        {categories.length > 0 && (
          <div className="mb-10 flex flex-wrap gap-2">
            <Badge variant="default" className="cursor-pointer">All</Badge>
            {categories.map((cat) => (
              <Badge key={cat} variant="secondary" className="cursor-pointer hover:bg-primary/20 transition-colors">
                {cat}
              </Badge>
            ))}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : posts.length === 0 ? (
          <p className="text-center text-muted-foreground py-20">No posts yet. Check back soon!</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 reveal-stagger visible">
            {posts.map((post) => (
              <Link to={`/blog/${post.id}`} key={post.id} className="card-lift group rounded-xl border border-border bg-card overflow-hidden transition-all hover:border-primary/30">
                {post.image && (
                  <div className="aspect-[16/10] overflow-hidden">
                    <img src={post.image} alt={post.title} className="h-full w-full object-cover transition-transform group-hover:scale-105" loading="lazy" />
                  </div>
                )}
                <div className="p-5">
                  {post.category && <Badge variant="secondary" className="mb-3 text-[10px]">{post.category}</Badge>}
                  <h2 className="text-lg font-semibold leading-snug group-hover:text-primary transition-colors">{post.title}</h2>
                  <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{post.excerpt}</p>
                  <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><User className="h-3.5 w-3.5" />{post.author}</span>
                    {post.createdAt && <span>{format(post.createdAt.toDate(), "MMM d, yyyy")}</span>}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

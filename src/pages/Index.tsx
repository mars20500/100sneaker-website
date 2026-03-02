import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Zap, Shield, Star, Clock, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { scoutMatches } from "@/data/mockData";
import { getPublishedPosts, BlogPostData } from "@/lib/blogService";
import { format } from "date-fns";
import { useSiteContent } from "@/hooks/useSiteContent";
import { useReveal } from "@/hooks/useReveal";

export default function Index() {
  const [posts, setPosts] = useState<BlogPostData[]>([]);
  const { content } = useSiteContent();
  const { hero, brands, blogSection, aiScout, categories } = content;

  useReveal();

  useEffect(() => {
    getPublishedPosts()
      .then((data) => setPosts([...data].sort((a, b) => (b.createdAt?.toMillis?.() ?? 0) - (a.createdAt?.toMillis?.() ?? 0))))
      .catch(() => { });
  }, []);

  const displayedPosts = blogSection.highlightedPostIds.length > 0
    ? blogSection.highlightedPostIds.map((id) => posts.find((p) => p.id === id)).filter(Boolean) as BlogPostData[]
    : posts.slice(0, blogSection.postCount);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden py-20 md:py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent" />
        <div className="container mx-auto px-4 relative">
          <div className="grid items-center gap-12 md:grid-cols-2">
            <div className="reveal visible">
              <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">{hero.badge}</Badge>
              <h1 className="text-4xl font-extrabold leading-tight tracking-tight md:text-6xl">
                {hero.title}{" "}
                <span className="text-gradient">{hero.titleHighlight}</span>
              </h1>
              <p className="mt-4 text-lg text-muted-foreground max-w-md">{hero.description}</p>
              <div className="mt-8 flex gap-3">
                {hero.ctaButtons.map((btn, i) => (
                  <Button key={i} size="lg" variant={btn.variant} asChild>
                    <Link to={btn.link}>{btn.text} {btn.variant === "default" && <ArrowRight className="ml-2 h-4 w-4" />}</Link>
                  </Button>
                ))}
              </div>
              <div className="mt-8 flex items-center gap-6 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5"><Shield className="h-4 w-4 text-success" /> Verified Authentic</span>
                <span className="flex items-center gap-1.5"><Zap className="h-4 w-4 text-warning" /> Free Shipping</span>
              </div>
            </div>
            <div className="relative">
              <div className="hero-image-wrapper relative aspect-square rounded-3xl bg-gradient-to-br from-primary/20 to-primary/5 p-8">
                <img src={hero.image} alt="Featured sneaker" className="hero-image h-full w-full object-contain drop-shadow-2xl" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trusted Brands — Marquee */}
      <section className="border-y border-border bg-card/30 py-8 overflow-hidden">
        <div className="container mx-auto px-4">
          <p className="mb-6 text-center text-xs font-medium uppercase tracking-widest text-muted-foreground">Trusted Brands</p>
        </div>
        <div className="relative overflow-hidden">
          <div className="marquee-track gap-16 md:gap-24">
            {[...brands, ...brands].map((b, i) => (
              <span key={`${b.name}-${i}`} className="text-lg font-bold text-muted-foreground/50 transition-colors hover:text-foreground whitespace-nowrap px-8">
                {b.name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Latest from the Blog */}
      <section className="py-16 reveal">
        <div className="container mx-auto px-4">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <h2 className="text-2xl font-bold">Latest from the Blog</h2>
              <p className="mt-1 text-sm text-muted-foreground">Sneaker news, guides, and AI insights</p>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/blog">View All <ArrowRight className="ml-1 h-4 w-4" /></Link>
            </Button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 reveal-stagger visible">
            {displayedPosts.slice(0, blogSection.postCount).map((post) => (
              <Link key={post.id} to={`/blog/${post.id}`} className="card-lift group rounded-xl border border-border bg-card overflow-hidden transition-all hover:border-primary/30">
                {post.image && (
                  <div className="aspect-[4/3] overflow-hidden">
                    <img src={post.image} alt={post.title} className="h-full w-full object-cover transition-transform group-hover:scale-105" loading="lazy" />
                  </div>
                )}
                <div className="p-4">
                  {post.category && <Badge variant="secondary" className="mb-2 text-[10px]">{post.category}</Badge>}
                  <h3 className="text-sm font-semibold leading-snug line-clamp-2 group-hover:text-primary transition-colors">{post.title}</h3>
                  <p className="mt-1.5 text-xs text-muted-foreground line-clamp-2">{post.excerpt}</p>
                  <div className="mt-3 flex items-center gap-3 text-[11px] text-muted-foreground">
                    <span className="flex items-center gap-1"><User className="h-3 w-3" />{post.author}</span>
                    {post.createdAt && <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{format(post.createdAt.toDate(), "MMM d, yyyy")}</span>}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* AI Scout CTA */}
      <section className="py-16 reveal">
        <div className="container mx-auto px-4">
          <div className="glass-panel rounded-2xl p-8 md:p-12">
            <div className="grid items-center gap-8 md:grid-cols-2">
              <div>
                <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
                  <Zap className="mr-1 h-3 w-3" /> {aiScout.badge}
                </Badge>
                <h2 className="text-2xl font-bold md:text-3xl">{aiScout.title}</h2>
                <p className="mt-2 text-lg text-primary font-medium">{aiScout.subtitle}</p>
                <p className="mt-3 text-sm text-muted-foreground max-w-md">{aiScout.description}</p>
                <Button className="mt-6" asChild>
                  <Link to={aiScout.ctaLink}>{aiScout.ctaText} <ArrowRight className="ml-2 h-4 w-4" /></Link>
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-3 reveal-stagger visible">
                {scoutMatches.slice(0, 4).map((m) => (
                  <div key={m.id} className="card-lift rounded-xl border border-border bg-secondary/50 p-3">
                    <div className="relative aspect-square rounded-lg overflow-hidden bg-muted mb-2">
                      <img src={m.image} alt={m.name} className="h-full w-full object-cover" loading="lazy" />
                      <Badge className="absolute top-2 left-2 bg-success text-success-foreground text-[10px]">{m.match}% Match</Badge>
                    </div>
                    <p className="text-xs font-medium truncate">{m.name}</p>
                    <p className="text-xs text-primary font-bold">${m.price}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Browse by Category */}
      <section className="py-16 reveal">
        <div className="container mx-auto px-4">
          <h2 className="mb-8 text-2xl font-bold">Browse by Category</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 reveal-stagger visible">
            {[...categories].sort((a, b) => a.order - b.order).map((cat) => (
              <Link key={cat.name} to="/blog" className="card-lift group relative overflow-hidden rounded-xl border border-border bg-gradient-to-br from-secondary to-card p-8 transition-all hover:border-primary/30">
                <h3 className="text-xl font-bold">{cat.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{cat.description}</p>
                <p className="mt-2 text-xs text-primary font-medium">{cat.count} articles →</p>
                <Star className="absolute right-4 top-4 h-8 w-8 text-muted-foreground/10 transition-colors group-hover:text-primary/20" />
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

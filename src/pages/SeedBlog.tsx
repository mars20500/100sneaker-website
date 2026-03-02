import { useState } from "react";
import { createPost } from "@/lib/blogService";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const SEED_POSTS = [
  {
    title: "Nike Dunk Low 'Panda' Restock: Everything You Need to Know",
    excerpt: "The most sought-after colorway of 2024 is back in stock. Here's how to grab a pair before they sell out again.",
    content: "<p>The Nike Dunk Low 'Panda' has been one of the most popular sneakers for the past three years, and Nike just announced another major restock. Originally released in 2021, the black-and-white colorway became an instant classic thanks to its clean, versatile design.</p><p>This time around, Nike is making the release widely available through SNKRS and select retailers. Retail price remains at $110, making it one of the best value propositions in sneakers today.</p><p>For budget-conscious sneakerheads, this is a can't-miss opportunity. The resale market has cooled significantly on Pandas, but nothing beats paying retail.</p>",
    image: "https://images.unsplash.com/photo-1600269452121-4f2416e55c28?w=800&q=80",
    author: "100 Sneaker Team",
    category: "Restocks",
    status: "published" as const,
  },
  {
    title: "Top 5 Sneakers Under $100 That Look Way More Expensive",
    excerpt: "You don't need to break the bank to look fresh. These five picks punch well above their price tag.",
    content: "<p>Looking good doesn't have to cost a fortune. We've rounded up five sneakers that retail under $100 but have the design quality and materials to rival shoes twice their price.</p><p><strong>1. New Balance 480</strong> — Clean leather upper, retro basketball vibes, usually found around $80.</p><p><strong>2. Adidas Gazelle</strong> — A timeless silhouette with premium suede, often on sale for under $90.</p><p><strong>3. Puma Suede Classic</strong> — The original hip-hop sneaker, still relevant and always affordable.</p><p><strong>4. Converse Chuck 70</strong> — The upgraded Chuck with better cushioning and materials, around $85.</p><p><strong>5. Reebok Club C 85</strong> — Minimalist, comfortable, and endlessly stylish at $75.</p>",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80",
    author: "100 Sneaker Team",
    category: "Guides",
    status: "published" as const,
  },
  {
    title: "How to Spot Fake Jordans: A Buyer's Guide for 2026",
    excerpt: "The counterfeit sneaker market is more sophisticated than ever. Learn to protect yourself with these expert tips.",
    content: "<p>As sneaker resale continues to grow, so does the counterfeit market. In 2026, fakes are harder to spot than ever — but with the right knowledge, you can avoid getting scammed.</p><p><strong>Check the Box</strong> — Authentic Jordan boxes have specific label formatting, correct font weights, and matching style codes. Fakes often get small details wrong.</p><p><strong>Examine the Stitching</strong> — Real Jordans have consistent, tight stitching. Loose threads and uneven patterns are red flags.</p><p><strong>Smell Test</strong> — It sounds odd, but authentic sneakers have a distinct factory smell. Strong chemical or glue odors suggest fakes.</p><p><strong>Use Authentication Services</strong> — When in doubt, use services like CheckCheck or Legit Check to verify before purchasing.</p><p>When shopping on a budget, stick to trusted retailers and authorized resellers. If a deal seems too good to be true, it probably is.</p>",
    image: "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=800&q=80",
    author: "100 Sneaker Team",
    category: "Tips",
    status: "published" as const,
  },
  {
    title: "The Rise of New Balance: From Dad Shoes to Streetwear Icons",
    excerpt: "How a 100-year-old brand became the coolest name in sneakers — and why their deals are unbeatable.",
    content: "<p>Five years ago, calling New Balance 'cool' would have earned you strange looks. Today, the Boston-based brand sits at the top of streetwear culture alongside Nike and Adidas.</p><p>The transformation started with collaborations — Aimé Leon Dore, JJJJound, and Salehe Bembury all brought high-fashion credibility to NB's classic silhouettes. The 550, 2002R, and 990 series became must-haves practically overnight.</p><p>For budget sneakerheads, this is great news. While the hyped collabs command premium prices, New Balance's GR (general release) lineup offers incredible quality at accessible prices. Models like the 574 and 480 regularly dip below $80 on sale.</p><p>The lesson? You don't need the hyped colorway to enjoy great design and comfort. New Balance's standard offerings are some of the best values in the game.</p>",
    image: "https://images.unsplash.com/photo-1539185441755-769473a23570?w=800&q=80",
    author: "100 Sneaker Team",
    category: "Culture",
    status: "published" as const,
  },
  {
    title: "Best Sneaker Deals This Week: March 2026 Roundup",
    excerpt: "We scoured the internet so you don't have to. Here are the best sneaker deals dropping this week.",
    content: "<p>Every week we compile the best sneaker deals across all major retailers. Here are this week's top picks:</p><p><strong>Nike Air Force 1 '07 — $72 (was $115)</strong><br/>Use code SPRING30 at Nike.com. Multiple colorways available.</p><p><strong>Adidas Superstar — $55 (was $100)</strong><br/>End-of-season clearance on Adidas.com. Shell toes at nearly half price.</p><p><strong>Jordan 1 Low SE — $89 (was $120)</strong><br/>Select colorways on sale at Foot Locker with free shipping.</p><p><strong>Asics Gel-1130 — $85 (was $110)</strong><br/>The hottest running-inspired silhouette at a solid discount on ASICS.com.</p><p>Pro tip: Stack cashback apps like Rakuten or Honey on top of these sales for even deeper savings. Every dollar counts when you're building a collection on a budget.</p>",
    image: "https://images.unsplash.com/photo-1556906781-9a412961c28c?w=800&q=80",
    author: "100 Sneaker Team",
    category: "Deals",
    status: "published" as const,
  },
];

export default function SeedBlog() {
  const [status, setStatus] = useState<"idle" | "seeding" | "done" | "error">("idle");
  const navigate = useNavigate();

  const handleSeed = async () => {
    setStatus("seeding");
    try {
      for (const post of SEED_POSTS) {
        await createPost(post);
      }
      setStatus("done");
    } catch (e) {
      console.error(e);
      setStatus("error");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="max-w-md text-center space-y-4">
        <h1 className="text-2xl font-bold">Seed Blog Posts</h1>
        <p className="text-muted-foreground">This will create {SEED_POSTS.length} realistic blog posts in Firestore.</p>
        {status === "idle" && <Button onClick={handleSeed} size="lg">Create Seed Posts</Button>}
        {status === "seeding" && <p className="text-muted-foreground">Creating posts...</p>}
        {status === "done" && (
          <div className="space-y-2">
            <p className="text-green-500 font-semibold">✓ {SEED_POSTS.length} posts created!</p>
            <Button onClick={() => navigate("/blog")}>View Blog</Button>
          </div>
        )}
        {status === "error" && <p className="text-destructive">Failed — make sure you're logged in as admin first.</p>}
      </div>
    </div>
  );
}

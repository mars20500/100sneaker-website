import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "./firebase";

// ── Types ──────────────────────────────────────────────

export interface NavLinkItem {
  label: string;
  url: string;
}

export interface HeaderContent {
  logoInitials: string;
  logoText: string;
  logoImage?: string;
  navLinks: NavLinkItem[];
}

export interface FooterColumn {
  title: string;
  links: NavLinkItem[];
}

export interface SocialLink {
  icon: string; // lucide icon name
  url: string;
}

export interface FooterContent {
  description: string;
  columns: FooterColumn[];
  copyright: string;
  socialLinks: SocialLink[];
}

export interface CtaButton {
  text: string;
  link: string;
  variant: "default" | "outline";
}

export interface HeroContent {
  badge: string;
  title: string;
  titleHighlight: string;
  description: string;
  image: string;
  ctaButtons: CtaButton[];
}

export interface BrandItem {
  name: string;
  logo?: string;
  link?: string;
}

export interface BlogSectionContent {
  postCount: number;
  highlightedPostIds: string[];
}

export interface AiScoutContent {
  badge: string;
  title: string;
  subtitle: string;
  description: string;
  ctaText: string;
  ctaLink: string;
}

export interface CategoryItem {
  name: string;
  description: string;
  count: number;
  image?: string;
  order: number;
}

export interface SiteContent {
  header: HeaderContent;
  footer: FooterContent;
  hero: HeroContent;
  brands: BrandItem[];
  blogSection: BlogSectionContent;
  aiScout: AiScoutContent;
  categories: CategoryItem[];
}

// ── Defaults ───────────────────────────────────────────

export const defaultSiteContent: SiteContent = {
  header: {
    logoInitials: "1S",
    logoText: "100 Sneaker",
    logoImage: "",
    navLinks: [
      { label: "Blog", url: "/blog" },
      { label: "AI Scout", url: "/scout" },
      { label: "Authenticity", url: "#" },
    ],
  },
  footer: {
    description: "Iconic sneakers at budget-friendly prices. AI-powered deals you won't find anywhere else.",
    columns: [
      {
        title: "Blog",
        links: [
          { label: "Latest Posts", url: "/blog" },
          { label: "Sneaker Culture", url: "/blog" },
          { label: "Deal Alerts", url: "/blog" },
          { label: "Style Guides", url: "/blog" },
        ],
      },
      {
        title: "Support",
        links: [
          { label: "FAQ", url: "#" },
          { label: "Shipping", url: "#" },
          { label: "Returns", url: "#" },
          { label: "Contact", url: "#" },
        ],
      },
    ],
    copyright: "© 2026 100 Sneaker. All rights reserved.",
    socialLinks: [],
  },
  hero: {
    badge: "AI-Powered Deals",
    title: "Iconic Style.",
    titleHighlight: "Under $100.",
    description: "Premium sneakers at budget-friendly prices. Our AI scouts the best deals so you don't have to.",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=600&fit=crop",
    ctaButtons: [
      { text: "Read Blog", link: "/blog", variant: "default" },
      { text: "Try AI Scout", link: "/scout", variant: "outline" },
    ],
  },
  brands: [
    { name: "Nike" }, { name: "Adidas" }, { name: "Puma" },
    { name: "Reebok" }, { name: "Vans" }, { name: "New Balance" },
  ],
  blogSection: { postCount: 4, highlightedPostIds: [] },
  aiScout: {
    badge: "AI-Powered",
    title: "Can't afford your grail?",
    subtitle: "Let AI find the dupe.",
    description: "Upload a photo of any sneaker and our AI will find visually similar alternatives within your budget.",
    ctaText: "Try AI Scout",
    ctaLink: "/scout",
  },
  categories: [
    { name: "Sneaker Culture", description: "Trends, history, and community stories", count: 24, order: 0 },
    { name: "Deal Alerts", description: "Latest drops and price notifications", count: 18, order: 1 },
    { name: "Style Guides", description: "How to rock your kicks with confidence", count: 15, order: 2 },
    { name: "AI & Tech", description: "How our AI finds your perfect match", count: 9, order: 3 },
    { name: "Brand Spotlights", description: "Deep dives into iconic sneaker brands", count: 12, order: 4 },
    { name: "Reviews", description: "Honest reviews from the 100 Sneaker team", count: 21, order: 5 },
  ],
};

// ── Firestore helpers ──────────────────────────────────

const DOC_REF = doc(db, "settings", "siteContent");

export async function getSiteContent(): Promise<SiteContent> {
  const snap = await getDoc(DOC_REF);
  if (snap.exists()) {
    return { ...defaultSiteContent, ...snap.data() } as SiteContent;
  }
  return defaultSiteContent;
}

export async function saveSiteContent(content: SiteContent): Promise<void> {
  await setDoc(DOC_REF, content, { merge: true });
}

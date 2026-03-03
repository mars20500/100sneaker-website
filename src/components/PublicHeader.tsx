import { Search, Menu, X, Instagram, Facebook, Youtube, Github, Linkedin, Link as LinkIcon } from "lucide-react";
import { XIcon } from "@/components/icons/XIcon";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useSiteContent } from "@/hooks/useSiteContent";

const IconMap: Record<string, any> = {
  twitter: XIcon,
  x: XIcon,
  instagram: Instagram,
  facebook: Facebook,
  youtube: Youtube,
  github: Github,
  linkedin: Linkedin
};

export function PublicHeader() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { content, loading } = useSiteContent();
  const { header } = content;

  return (
    <header className="sticky top-0 z-50 glass-panel">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2">
          {loading ? (
            <div className="h-12 w-12" />
          ) : header.logoImage ? (
            <img src={header.logoImage} alt={header.logoText} className="h-12 w-12 rounded-lg object-contain" />
          ) : (
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary">
              <span className="text-sm font-bold text-primary-foreground">{header.logoInitials}</span>
            </div>
          )}
          <span className="text-lg font-bold tracking-tight">{header.logoText}</span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">

          {header.navLinks.map((l) => (
            <Link
              key={l.label}
              to={l.url}
              className={`link-glow text-sm font-medium transition-colors hover:text-primary ${location.pathname === l.url ? "text-primary" : "text-muted-foreground"
                }`}
            >
              {l.label}
            </Link>
          ))}
          {content.footer.socialLinks?.length > 0 && (
            <div className="flex items-center gap-3 border-l border-border pl-6 ml-2">
              {content.footer.socialLinks.map((social, i) => {
                const Icon = IconMap[social.icon.toLowerCase()] || LinkIcon;
                const href = social.url.startsWith("http") ? social.url : `https://${social.url}`;
                return (
                  <a key={i} href={href} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                    <Icon className="h-4 w-4" />
                    <span className="sr-only">{social.icon}</span>
                  </a>
                );
              })}
            </div>
          )}
        </nav>

        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-border bg-card px-4 py-4 md:hidden">

          {header.navLinks.map((l) => (
            <Link key={l.label} to={l.url} className="block py-2 text-sm text-muted-foreground hover:text-primary" onClick={() => setMobileOpen(false)}>
              {l.label}
            </Link>
          ))}

          {content.footer.socialLinks?.length > 0 && (
            <div className="flex items-center gap-4 py-4 mt-2 border-t border-border">
              {content.footer.socialLinks.map((social, i) => {
                const Icon = IconMap[social.icon.toLowerCase()] || LinkIcon;
                const href = social.url.startsWith("http") ? social.url : `https://${social.url}`;
                return (
                  <a key={i} href={href} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                    <Icon className="h-5 w-5" />
                    <span className="sr-only">{social.icon}</span>
                  </a>
                );
              })}
            </div>
          )}
        </div>
      )}
    </header>
  );
}

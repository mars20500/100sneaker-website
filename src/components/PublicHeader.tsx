import { Search, Menu, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useSiteContent } from "@/hooks/useSiteContent";

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
          <Link
            to="/"
            className={`link-glow text-sm font-medium transition-colors hover:text-primary ${location.pathname === "/" ? "text-primary" : "text-muted-foreground"}`}
          >
            Home
          </Link>
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
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search sneakers..." className="w-48 bg-secondary pl-8 text-sm" />
          </div>
        </div>

        <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {mobileOpen && (
        <div className="border-t border-border bg-card px-4 py-4 md:hidden">
          <Link to="/" className="block py-2 text-sm text-muted-foreground hover:text-primary" onClick={() => setMobileOpen(false)}>
            Home
          </Link>
          {header.navLinks.map((l) => (
            <Link key={l.label} to={l.url} className="block py-2 text-sm text-muted-foreground hover:text-primary" onClick={() => setMobileOpen(false)}>
              {l.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}

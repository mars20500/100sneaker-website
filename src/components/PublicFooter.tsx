import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useSiteContent } from "@/hooks/useSiteContent";
import { Instagram, Facebook, Youtube, Github, Linkedin, Link as LinkIcon } from "lucide-react";
import { XIcon } from "@/components/icons/XIcon";

const IconMap: Record<string, any> = {
  twitter: XIcon,
  x: XIcon,
  instagram: Instagram,
  facebook: Facebook,
  youtube: Youtube,
  github: Github,
  linkedin: Linkedin
};

export function PublicFooter() {
  const { content } = useSiteContent();
  const { header, footer } = content;

  return (
    <footer className="border-t border-border bg-card/50 py-12">
      <div className="container mx-auto grid gap-8 px-4 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2 mb-4">
            {header.logoImage ? (
              <img src={header.logoImage} alt={header.logoText} className="h-12 w-12 rounded-lg object-contain" />
            ) : (
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary">
                <span className="text-sm font-bold text-primary-foreground">{header.logoInitials}</span>
              </div>
            )}
            <span className="text-lg font-bold">{header.logoText}</span>
          </div>
          <p className="text-sm text-muted-foreground">{footer.description}</p>
        </div>
        {footer.columns.map((col) => (
          <div key={col.title}>
            <h4 className="mb-3 text-sm font-semibold">{col.title}</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {col.links.map((link) => (
                <li key={link.label}>
                  <Link to={link.url} className="link-glow cursor-pointer hover:text-primary">{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
        <div>
          <h4 className="mb-3 text-sm font-semibold">Newsletter</h4>
          <p className="mb-3 text-sm text-muted-foreground">Get the latest drops and deals.</p>
          <div className="flex gap-2">
            <Input placeholder="Email address" className="bg-secondary text-sm" />
            <Button size="sm">Join</Button>
          </div>
        </div>
      </div>
      <div className="container mx-auto mt-8 border-t border-border px-4 pt-6 flex flex-col items-center justify-between gap-4 md:flex-row">
        <p className="text-center text-xs text-muted-foreground">{footer.copyright}</p>

        {footer.socialLinks && footer.socialLinks.length > 0 && (
          <div className="flex items-center gap-4">
            {footer.socialLinks.map((social, i) => {
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
    </footer>
  );
}

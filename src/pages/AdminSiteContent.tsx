import { useEffect, useState, useRef } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2, GripVertical, Save, Upload, X } from "lucide-react";
import { toast } from "sonner";
import { uploadToR2 } from "@/lib/r2Upload";
import {
  getSiteContent, saveSiteContent, defaultSiteContent,
  type SiteContent, type NavLinkItem, type FooterColumn, type CtaButton,
  type BrandItem, type CategoryItem,
} from "@/lib/siteContentService";

export default function AdminSiteContent() {
  const [content, setContent] = useState<SiteContent>(defaultSiteContent);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const logoInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    getSiteContent()
      .then(setContent)
      .catch(() => toast.error("Failed to load site content"))
      .finally(() => setLoading(false));
  }, []);

  const save = async () => {
    setSaving(true);
    try {
      await saveSiteContent(content);
      toast.success("Site content saved!");
    } catch {
      toast.error("Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const update = <K extends keyof SiteContent>(key: K, value: SiteContent[K]) =>
    setContent((prev) => ({ ...prev, [key]: value }));

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingLogo(true);
    try {
      const url = await uploadToR2(file);
      update("header", { ...content.header, logoImage: url });
      toast.success("Logo uploaded! Click Save All to apply.");
    } catch {
      toast.error("Failed to upload logo");
    } finally {
      setUploadingLogo(false);
      if (logoInputRef.current) logoInputRef.current.value = "";
    }
  };

  if (loading) return <div className="flex items-center justify-center p-12"><div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Site Content</h1>
          <p className="text-sm text-muted-foreground">Manage all public-facing content from one place.</p>
        </div>
        <Button onClick={save} disabled={saving}>
          <Save className="mr-2 h-4 w-4" /> {saving ? "Saving…" : "Save All"}
        </Button>
      </div>

      <Tabs defaultValue="header" className="w-full">
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="header">Header</TabsTrigger>
          <TabsTrigger value="footer">Footer</TabsTrigger>
          <TabsTrigger value="hero">Hero</TabsTrigger>
          <TabsTrigger value="brands">Brands</TabsTrigger>
          <TabsTrigger value="blog">Blog</TabsTrigger>
          <TabsTrigger value="aiscout">AI Scout</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
        </TabsList>

        {/* ── Header ─────────────────────── */}
        <TabsContent value="header">
          <Card>
            <CardHeader><CardTitle>Header Settings</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              {/* Logo Upload */}
              <div>
                <Label>Logo Image</Label>
                <div className="mt-2 flex items-center gap-4">
                  {content.header.logoImage ? (
                    <div className="relative">
                      <img src={content.header.logoImage} alt="Logo" className="h-16 w-16 rounded-lg border border-border object-contain bg-secondary p-1" />
                      <button
                        onClick={() => update("header", { ...content.header, logoImage: "" })}
                        className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-destructive-foreground text-xs"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex h-16 w-16 items-center justify-center rounded-lg border-2 border-dashed border-border bg-secondary/50 text-muted-foreground">
                      <Upload className="h-5 w-5" />
                    </div>
                  )}
                  <div>
                    <input ref={logoInputRef} type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                    <Button variant="outline" size="sm" onClick={() => logoInputRef.current?.click()} disabled={uploadingLogo}>
                      <Upload className="mr-1 h-4 w-4" /> {uploadingLogo ? "Uploading…" : "Upload Logo"}
                    </Button>
                    <p className="mt-1 text-xs text-muted-foreground">PNG, JPG, SVG. Falls back to initials if empty.</p>
                  </div>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label>Logo Initials (fallback)</Label>
                  <Input value={content.header.logoInitials} onChange={(e) => update("header", { ...content.header, logoInitials: e.target.value })} />
                </div>
                <div>
                  <Label>Logo Text</Label>
                  <Input value={content.header.logoText} onChange={(e) => update("header", { ...content.header, logoText: e.target.value })} />
                </div>
              </div>
              <div>
                <Label>Navigation Links</Label>
                <div className="mt-2 space-y-2">
                  {content.header.navLinks.map((link, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <Input placeholder="Label" value={link.label} onChange={(e) => {
                        const links = [...content.header.navLinks];
                        links[i] = { ...links[i], label: e.target.value };
                        update("header", { ...content.header, navLinks: links });
                      }} />
                      <Input placeholder="URL" value={link.url} onChange={(e) => {
                        const links = [...content.header.navLinks];
                        links[i] = { ...links[i], url: e.target.value };
                        update("header", { ...content.header, navLinks: links });
                      }} />
                      <Button variant="ghost" size="icon" onClick={() => {
                        const links = content.header.navLinks.filter((_, j) => j !== i);
                        update("header", { ...content.header, navLinks: links });
                      }}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                    </div>
                  ))}
                  <Button variant="outline" size="sm" onClick={() => update("header", { ...content.header, navLinks: [...content.header.navLinks, { label: "", url: "" }] })}>
                    <Plus className="mr-1 h-4 w-4" /> Add Link
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── Footer ─────────────────────── */}
        <TabsContent value="footer">
          <Card>
            <CardHeader><CardTitle>Footer Settings</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Site Description</Label>
                <Textarea value={content.footer.description} onChange={(e) => update("footer", { ...content.footer, description: e.target.value })} />
              </div>
              <div>
                <Label>Copyright Text</Label>
                <Input value={content.footer.copyright} onChange={(e) => update("footer", { ...content.footer, copyright: e.target.value })} />
              </div>
              <div>
                <Label>Footer Columns</Label>
                {content.footer.columns.map((col, ci) => (
                  <div key={ci} className="mt-3 rounded-lg border border-border p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <Input placeholder="Column title" value={col.title} className="max-w-xs" onChange={(e) => {
                        const cols = [...content.footer.columns];
                        cols[ci] = { ...cols[ci], title: e.target.value };
                        update("footer", { ...content.footer, columns: cols });
                      }} />
                      <Button variant="ghost" size="icon" onClick={() => {
                        update("footer", { ...content.footer, columns: content.footer.columns.filter((_, j) => j !== ci) });
                      }}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                    </div>
                    {col.links.map((link, li) => (
                      <div key={li} className="flex items-center gap-2 pl-4">
                        <Input placeholder="Label" value={link.label} onChange={(e) => {
                          const cols = [...content.footer.columns];
                          const links = [...cols[ci].links];
                          links[li] = { ...links[li], label: e.target.value };
                          cols[ci] = { ...cols[ci], links };
                          update("footer", { ...content.footer, columns: cols });
                        }} />
                        <Input placeholder="URL" value={link.url} onChange={(e) => {
                          const cols = [...content.footer.columns];
                          const links = [...cols[ci].links];
                          links[li] = { ...links[li], url: e.target.value };
                          cols[ci] = { ...cols[ci], links };
                          update("footer", { ...content.footer, columns: cols });
                        }} />
                        <Button variant="ghost" size="icon" onClick={() => {
                          const cols = [...content.footer.columns];
                          cols[ci] = { ...cols[ci], links: cols[ci].links.filter((_, j) => j !== li) };
                          update("footer", { ...content.footer, columns: cols });
                        }}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                      </div>
                    ))}
                    <Button variant="outline" size="sm" className="ml-4" onClick={() => {
                      const cols = [...content.footer.columns];
                      cols[ci] = { ...cols[ci], links: [...cols[ci].links, { label: "", url: "" }] };
                      update("footer", { ...content.footer, columns: cols });
                    }}><Plus className="mr-1 h-4 w-4" /> Add Link</Button>
                  </div>
                ))}
                <Button variant="outline" size="sm" className="mt-2" onClick={() => {
                  update("footer", { ...content.footer, columns: [...content.footer.columns, { title: "", links: [] }] });
                }}><Plus className="mr-1 h-4 w-4" /> Add Column</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── Hero ───────────────────────── */}
        <TabsContent value="hero">
          <Card>
            <CardHeader><CardTitle>Hero Section</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label>Badge Text</Label>
                  <Input value={content.hero.badge} onChange={(e) => update("hero", { ...content.hero, badge: e.target.value })} />
                </div>
                <div>
                  <Label>Hero Image URL</Label>
                  <Input value={content.hero.image} onChange={(e) => update("hero", { ...content.hero, image: e.target.value })} />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label>Title</Label>
                  <Input value={content.hero.title} onChange={(e) => update("hero", { ...content.hero, title: e.target.value })} />
                </div>
                <div>
                  <Label>Title Highlight</Label>
                  <Input value={content.hero.titleHighlight} onChange={(e) => update("hero", { ...content.hero, titleHighlight: e.target.value })} />
                </div>
              </div>
              <div>
                <Label>Description</Label>
                <Textarea value={content.hero.description} onChange={(e) => update("hero", { ...content.hero, description: e.target.value })} />
              </div>
              <div>
                <Label>CTA Buttons</Label>
                <div className="mt-2 space-y-2">
                  {content.hero.ctaButtons.map((btn, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <Input placeholder="Button text" value={btn.text} onChange={(e) => {
                        const btns = [...content.hero.ctaButtons];
                        btns[i] = { ...btns[i], text: e.target.value };
                        update("hero", { ...content.hero, ctaButtons: btns });
                      }} />
                      <Input placeholder="Link" value={btn.link} onChange={(e) => {
                        const btns = [...content.hero.ctaButtons];
                        btns[i] = { ...btns[i], link: e.target.value };
                        update("hero", { ...content.hero, ctaButtons: btns });
                      }} />
                      <select className="rounded border border-border bg-secondary px-2 py-1.5 text-sm" value={btn.variant} onChange={(e) => {
                        const btns = [...content.hero.ctaButtons];
                        btns[i] = { ...btns[i], variant: e.target.value as "default" | "outline" };
                        update("hero", { ...content.hero, ctaButtons: btns });
                      }}>
                        <option value="default">Primary</option>
                        <option value="outline">Outline</option>
                      </select>
                      <Button variant="ghost" size="icon" onClick={() => {
                        update("hero", { ...content.hero, ctaButtons: content.hero.ctaButtons.filter((_, j) => j !== i) });
                      }}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                    </div>
                  ))}
                  <Button variant="outline" size="sm" onClick={() => update("hero", { ...content.hero, ctaButtons: [...content.hero.ctaButtons, { text: "", link: "", variant: "default" }] })}>
                    <Plus className="mr-1 h-4 w-4" /> Add Button
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── Brands ─────────────────────── */}
        <TabsContent value="brands">
          <Card>
            <CardHeader><CardTitle>Trusted Brands</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {content.brands.map((brand, i) => (
                <div key={i} className="flex items-center gap-2">
                  <GripVertical className="h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Brand name" value={brand.name} onChange={(e) => {
                    const b = [...content.brands];
                    b[i] = { ...b[i], name: e.target.value };
                    update("brands", b);
                  }} />
                  <Input placeholder="Logo URL (optional)" value={brand.logo || ""} onChange={(e) => {
                    const b = [...content.brands];
                    b[i] = { ...b[i], logo: e.target.value };
                    update("brands", b);
                  }} />
                  <Input placeholder="Link (optional)" value={brand.link || ""} onChange={(e) => {
                    const b = [...content.brands];
                    b[i] = { ...b[i], link: e.target.value };
                    update("brands", b);
                  }} />
                  <Button variant="ghost" size="icon" onClick={() => update("brands", content.brands.filter((_, j) => j !== i))}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))}
              <Button variant="outline" size="sm" onClick={() => update("brands", [...content.brands, { name: "" }])}>
                <Plus className="mr-1 h-4 w-4" /> Add Brand
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── Blog Section ───────────────── */}
        <TabsContent value="blog">
          <Card>
            <CardHeader><CardTitle>Blog Section (Homepage)</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Number of Posts to Show (1-8)</Label>
                <Input type="number" min={1} max={8} value={content.blogSection.postCount} onChange={(e) =>
                  update("blogSection", { ...content.blogSection, postCount: Math.min(8, Math.max(1, parseInt(e.target.value) || 4)) })
                } className="max-w-xs" />
              </div>
              <div>
                <Label>Highlighted Post IDs (optional, comma-separated)</Label>
                <Input
                  value={content.blogSection.highlightedPostIds.join(", ")}
                  onChange={(e) => update("blogSection", {
                    ...content.blogSection,
                    highlightedPostIds: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
                  })}
                  placeholder="Leave empty to show latest posts"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── AI Scout ───────────────────── */}
        <TabsContent value="aiscout">
          <Card>
            <CardHeader><CardTitle>AI Scout Section</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div><Label>Badge</Label><Input value={content.aiScout.badge} onChange={(e) => update("aiScout", { ...content.aiScout, badge: e.target.value })} /></div>
                <div><Label>CTA Link</Label><Input value={content.aiScout.ctaLink} onChange={(e) => update("aiScout", { ...content.aiScout, ctaLink: e.target.value })} /></div>
              </div>
              <div><Label>Title</Label><Input value={content.aiScout.title} onChange={(e) => update("aiScout", { ...content.aiScout, title: e.target.value })} /></div>
              <div><Label>Subtitle</Label><Input value={content.aiScout.subtitle} onChange={(e) => update("aiScout", { ...content.aiScout, subtitle: e.target.value })} /></div>
              <div><Label>Description</Label><Textarea value={content.aiScout.description} onChange={(e) => update("aiScout", { ...content.aiScout, description: e.target.value })} /></div>
              <div><Label>CTA Button Text</Label><Input value={content.aiScout.ctaText} onChange={(e) => update("aiScout", { ...content.aiScout, ctaText: e.target.value })} /></div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── Categories ─────────────────── */}
        <TabsContent value="categories">
          <Card>
            <CardHeader><CardTitle>Browse by Category</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {content.categories.sort((a, b) => a.order - b.order).map((cat, i) => (
                <div key={i} className="flex items-start gap-2 rounded-lg border border-border p-3">
                  <GripVertical className="mt-2 h-4 w-4 text-muted-foreground shrink-0" />
                  <div className="flex-1 grid gap-2 sm:grid-cols-3">
                    <Input placeholder="Name" value={cat.name} onChange={(e) => {
                      const cats = [...content.categories];
                      cats[i] = { ...cats[i], name: e.target.value };
                      update("categories", cats);
                    }} />
                    <Input placeholder="Description" value={cat.description} onChange={(e) => {
                      const cats = [...content.categories];
                      cats[i] = { ...cats[i], description: e.target.value };
                      update("categories", cats);
                    }} />
                    <Input placeholder="Article count" type="number" value={cat.count} onChange={(e) => {
                      const cats = [...content.categories];
                      cats[i] = { ...cats[i], count: parseInt(e.target.value) || 0 };
                      update("categories", cats);
                    }} />
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => update("categories", content.categories.filter((_, j) => j !== i))}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))}
              <Button variant="outline" size="sm" onClick={() => update("categories", [...content.categories, { name: "", description: "", count: 0, order: content.categories.length }])}>
                <Plus className="mr-1 h-4 w-4" /> Add Category
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

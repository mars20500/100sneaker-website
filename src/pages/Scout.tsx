import { useState } from "react";
import { Zap, Search, Loader2, ExternalLink, DollarSign, Store, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useReveal } from "@/hooks/useReveal";
import { scoutDeals, type ScoutResponse } from "@/lib/geminiService";

export default function Scout() {
  const [query, setQuery] = useState("");
  const [scanning, setScanning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<ScoutResponse | null>(null);
  const [error, setError] = useState("");

  useReveal();

  const handleScout = async () => {
    if (!query.trim()) return;
    setScanning(true);
    setProgress(0);
    setResult(null);
    setError("");

    // Animate progress while waiting for API
    const interval = setInterval(() => {
      setProgress((p) => (p >= 90 ? 90 : p + Math.random() * 8));
    }, 300);

    try {
      const data = await scoutDeals(query);
      setProgress(100);
      setTimeout(() => setResult(data), 300);
    } catch (e: any) {
      console.error("Scout error:", e);
      setError(e.message || "Failed to search. Please check your API key and try again.");
    } finally {
      clearInterval(interval);
      setScanning(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Left Panel */}
        <div className="reveal visible">
          <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
            <Zap className="mr-1 h-3 w-3" /> AI-Powered Tool
          </Badge>
          <h1 className="text-3xl font-extrabold md:text-4xl">
            Find Your Grail{" "}
            <span className="text-gradient">for Less</span>
          </h1>
          <p className="mt-3 text-muted-foreground max-w-md">
            Tell us what sneaker you're looking for and our AI will search the web to find the best budget-friendly deals for you.
          </p>

          {/* Search Input */}
          <div className="mt-8 space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder='e.g. "Nike Air Jordan 1 Low under $80"'
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !scanning && handleScout()}
                className="h-12 bg-card pl-11 text-base border-border"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              {["Air Jordan 1 under $80", "Dunk Low budget", "New Balance 550 deals", "Yeezy alternatives"].map((s) => (
                <button
                  key={s}
                  onClick={() => setQuery(s)}
                  className="rounded-full border border-border bg-card/50 px-3 py-1 text-xs text-muted-foreground hover:border-primary/40 hover:text-primary transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>

            <Button className="w-full h-12 text-base" size="lg" onClick={handleScout} disabled={scanning || !query.trim()}>
              {scanning ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Scouting the web...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-5 w-5" />
                  Scout Deals
                </>
              )}
            </Button>
          </div>

          {/* Progress */}
          {scanning && (
            <div className="mt-6 space-y-2">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>AI searching the web...</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-2" />
              <div className="flex gap-2 text-[10px] text-muted-foreground">
                <span className={progress > 10 ? "text-primary" : ""}>Understanding query</span>
                <span>→</span>
                <span className={progress > 40 ? "text-primary" : ""}>Searching stores</span>
                <span>→</span>
                <span className={progress > 70 ? "text-primary" : ""}>Comparing prices</span>
              </div>
            </div>
          )}

          {error && (
            <div className="mt-6 rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
              {error}
            </div>
          )}
        </div>

        {/* Right Panel - Results */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Deal Results</h2>
            {result && result.deals.length > 0 && (
              <Badge variant="secondary" className="text-xs">
                {result.deals.length} deals found
              </Badge>
            )}
          </div>

          {!result && !scanning && (
            <div className="flex h-[400px] items-center justify-center rounded-xl border border-border bg-card/30">
              <div className="text-center">
                <Search className="mx-auto h-12 w-12 text-muted-foreground/30" />
                <p className="mt-3 text-sm text-muted-foreground">Type a sneaker to see results</p>
              </div>
            </div>
          )}

          {scanning && !result && (
            <div className="flex h-[400px] items-center justify-center rounded-xl border border-border bg-card/30">
              <div className="text-center">
                <Loader2 className="mx-auto h-10 w-10 animate-spin text-primary" />
                <p className="mt-3 text-sm text-muted-foreground">Searching the web for deals...</p>
              </div>
            </div>
          )}

          {result && (
            <div className="space-y-4">
              {/* Summary */}
              {result.summary && (
                <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
                  <p className="text-sm text-foreground/90">{result.summary}</p>
                </div>
              )}

              {/* Deals */}
              {result.deals.length > 0 ? (
                <div className="space-y-3">
                  {result.deals.map((deal, i) => (
                    <a
                      key={i}
                      href={deal.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block rounded-xl border border-border bg-card p-4 transition-all hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 group"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-sm leading-tight group-hover:text-primary transition-colors">
                            {deal.name}
                          </h3>
                          <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Store className="h-3 w-3" /> {deal.store}
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-1 shrink-0">
                          <span className="text-lg font-bold text-primary flex items-center">
                            <DollarSign className="h-4 w-4" />
                            {deal.price.replace("$", "")}
                          </span>
                          <span className="flex items-center gap-1 text-xs text-muted-foreground group-hover:text-primary transition-colors">
                            View <ExternalLink className="h-3 w-3" />
                          </span>
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              ) : (
                <div className="rounded-xl border border-border bg-card/30 p-6 text-center">
                  <p className="text-sm text-muted-foreground">No specific deals found. Try a different search term!</p>
                </div>
              )}

              {/* Sources */}
              {result.sources.length > 0 && (
                <div className="mt-4 pt-4 border-t border-border">
                  <p className="text-xs text-muted-foreground mb-2">Sources:</p>
                  <div className="flex flex-wrap gap-2">
                    {result.sources.slice(0, 6).map((s, i) => (
                      <a
                        key={i}
                        href={s.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-1 text-[10px] text-muted-foreground hover:text-primary transition-colors"
                      >
                        <ExternalLink className="h-2.5 w-2.5" />
                        {s.title}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

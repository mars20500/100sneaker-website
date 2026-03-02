import { useState } from "react";
import { Upload, Link as LinkIcon, Zap, Shield, ArrowRight, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { scoutMatches } from "@/data/mockData";
import { useReveal } from "@/hooks/useReveal";

export default function Scout() {
  const [scanning, setScanning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showResults, setShowResults] = useState(false);

  useReveal();

  const handleScout = () => {
    setScanning(true);
    setProgress(0);
    setShowResults(false);
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          setScanning(false);
          setShowResults(true);
          return 100;
        }
        return p + 4;
      });
    }, 80);
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
            Upload a photo of your dream sneaker and our AI will find budget-friendly alternatives that look just as good.
          </p>

          {/* Upload Area — animated gradient border on hover */}
          <div className="animated-border mt-8 rounded-xl border-2 border-dashed border-border bg-card/50 p-8 text-center transition-colors hover:border-primary/30">
            <Upload className="mx-auto h-10 w-10 text-muted-foreground" />
            <p className="mt-3 text-sm font-medium">Drag & drop your sneaker image</p>
            <p className="mt-1 text-xs text-muted-foreground">PNG, JPG up to 10MB</p>
            <Button variant="outline" size="sm" className="mt-4">
              Browse Files
            </Button>
          </div>

          <div className="my-4 flex items-center gap-3">
            <div className="h-px flex-1 bg-border" />
            <span className="text-xs text-muted-foreground">or paste URL</span>
            <div className="h-px flex-1 bg-border" />
          </div>

          <div className="flex gap-2">
            <div className="relative flex-1">
              <LinkIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input placeholder="https://example.com/sneaker.jpg" className="bg-secondary pl-9" />
            </div>
          </div>

          <Button className="mt-6 w-full" size="lg" onClick={handleScout} disabled={scanning}>
            <Search className="mr-2 h-4 w-4" />
            {scanning ? "Scouting..." : "Scout"}
          </Button>

          {/* Progress */}
          {scanning && (
            <div className="mt-6 space-y-2">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>AI Analysis in progress...</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
              <div className="flex gap-2 text-[10px] text-muted-foreground">
                <span className={progress > 20 ? "text-primary" : ""}>Analyzing image</span>
                <span>→</span>
                <span className={progress > 50 ? "text-primary" : ""}>Matching styles</span>
                <span>→</span>
                <span className={progress > 80 ? "text-primary" : ""}>Finding deals</span>
              </div>
            </div>
          )}
        </div>

        {/* Right Panel - Results */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Budget Matches</h2>
            {showResults && (
              <Button variant="ghost" size="sm" className="text-xs text-muted-foreground">
                Filters
              </Button>
            )}
          </div>

          {!showResults && !scanning && (
            <div className="flex h-[400px] items-center justify-center rounded-xl border border-border bg-card/30">
              <div className="text-center">
                <Search className="mx-auto h-12 w-12 text-muted-foreground/30" />
                <p className="mt-3 text-sm text-muted-foreground">Upload a sneaker to see matches</p>
              </div>
            </div>
          )}

          {showResults && (
            <>
              <div className="grid gap-3 sm:grid-cols-2 reveal-stagger visible">
                {scoutMatches.map((m) => (
                  <div key={m.id} className="card-lift rounded-xl border border-border bg-card p-3 transition-all hover:border-primary/30">
                    <div className="relative aspect-square rounded-lg overflow-hidden bg-secondary mb-3">
                      <img src={m.image} alt={m.name} className="h-full w-full object-cover" loading="lazy" />
                      <Badge className="absolute top-2 left-2 bg-success text-success-foreground text-[10px]">
                        {m.match}% Match
                      </Badge>
                    </div>
                    <p className="text-xs text-primary font-medium">{m.brand}</p>
                    <h3 className="text-sm font-semibold leading-tight">{m.name}</h3>
                    <p className="mt-0.5 text-[11px] text-muted-foreground">{m.colorway}</p>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-lg font-bold">${m.price}</span>
                      <div className="flex items-center gap-1">
                        {m.authenticated && (
                          <Shield className="h-3 w-3 text-success" />
                        )}
                        <Button size="sm" variant="outline" className="h-7 text-xs">
                          View Deal <ArrowRight className="ml-1 h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="mt-6 w-full">Load More Matches</Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

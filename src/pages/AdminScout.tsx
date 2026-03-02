import { useState, useEffect, useRef } from "react";
import { Upload, Search, Zap, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface ScoutResult {
  name: string;
  brand: string;
  estimatedPrice: string;
  matchPercentage: number;
  description: string;
  whereToBuy: string[];
}

export default function AdminScout() {
  const [geminiKey, setGeminiKey] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  const [scanning, setScanning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<ScoutResult[]>([]);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    getDoc(doc(db, "settings", "gemini")).then((snap) => {
      if (snap.exists()) setGeminiKey(snap.data().apiKey || "");
    });
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      setResults([]);
      setError("");
    }
  };

  const fileToBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        resolve(result.split(",")[1]); // strip data:...;base64,
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const handleScout = async () => {
    if (!geminiKey) {
      toast({
        title: "API Key Missing",
        description: "Please set your Gemini API key in the Dashboard settings first.",
        variant: "destructive",
      });
      return;
    }
    if (!imageFile) {
      toast({ title: "No Image", description: "Please upload a sneaker image first.", variant: "destructive" });
      return;
    }

    setScanning(true);
    setProgress(0);
    setResults([]);
    setError("");

    const progressInterval = setInterval(() => {
      setProgress((p) => Math.min(p + 2, 90));
    }, 200);

    try {
      const base64 = await fileToBase64(imageFile);
      const mimeType = imageFile.type || "image/jpeg";

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    inlineData: { mimeType, data: base64 },
                  },
                  {
                    text: `You are a sneaker expert. Analyze this sneaker image and provide 4-6 budget-friendly alternatives that look similar. For each alternative, return a JSON array with objects containing:
- "name": the sneaker model name
- "brand": the brand
- "estimatedPrice": price range as string (e.g. "$45-$65")
- "matchPercentage": how similar it looks (0-100)
- "description": one sentence about why it's a good alternative
- "whereToBuy": array of 2-3 stores/sites where it can be found

Return ONLY the JSON array, no markdown, no explanation.`,
                  },
                ],
              },
            ],
          }),
        }
      );

      clearInterval(progressInterval);

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData?.error?.message || `API error: ${response.status}`);
      }

      const data = await response.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "";

      // Extract JSON from response
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      if (!jsonMatch) throw new Error("Could not parse AI response");

      const parsed: ScoutResult[] = JSON.parse(jsonMatch[0]);
      setResults(parsed);
      setProgress(100);
    } catch (err: any) {
      setError(err.message || "Failed to analyze image");
      toast({ title: "Scout Error", description: err.message, variant: "destructive" });
    } finally {
      clearInterval(progressInterval);
      setScanning(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">AI Scout</h1>
        <p className="text-sm text-muted-foreground">Upload a sneaker image to find budget-friendly alternatives using AI</p>
      </div>

      {!geminiKey && (
        <div className="flex items-center gap-3 rounded-lg border border-destructive/30 bg-destructive/5 p-4">
          <AlertTriangle className="h-5 w-5 text-destructive" />
          <div>
            <p className="text-sm font-medium">Gemini API key not configured</p>
            <p className="text-xs text-muted-foreground">Go to Dashboard to set your API key first.</p>
          </div>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Upload */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Upload Sneaker Image</CardTitle>
            </CardHeader>
            <CardContent>
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
              <div
                onClick={() => fileInputRef.current?.click()}
                className="cursor-pointer rounded-xl border-2 border-dashed border-border bg-card/50 p-8 text-center transition-colors hover:border-primary/30"
              >
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="mx-auto max-h-64 rounded-lg object-contain" />
                ) : (
                  <>
                    <Upload className="mx-auto h-10 w-10 text-muted-foreground" />
                    <p className="mt-3 text-sm font-medium">Click to upload a sneaker image</p>
                    <p className="mt-1 text-xs text-muted-foreground">PNG, JPG up to 10MB</p>
                  </>
                )}
              </div>
              <Button className="mt-4 w-full" size="lg" onClick={handleScout} disabled={scanning || !imageFile || !geminiKey}>
                <Search className="mr-2 h-4 w-4" />
                {scanning ? "Analyzing..." : "Find Alternatives"}
              </Button>
              {scanning && (
                <div className="mt-4 space-y-2">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>AI Analysis in progress...</span>
                    <span>{progress}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Results */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <Zap className="h-4 w-4 text-primary" /> Budget Matches
          </h2>

          {error && (
            <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4">
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          {results.length === 0 && !scanning && !error && (
            <div className="flex h-[300px] items-center justify-center rounded-xl border border-border bg-card/30">
              <div className="text-center">
                <Search className="mx-auto h-12 w-12 text-muted-foreground/30" />
                <p className="mt-3 text-sm text-muted-foreground">Upload a sneaker to see AI matches</p>
              </div>
            </div>
          )}

          {results.length > 0 && (
            <div className="grid gap-3">
              {results.map((r, i) => (
                <Card key={i} className="transition-all hover:border-primary/30">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-xs text-primary font-medium">{r.brand}</p>
                        <h3 className="text-sm font-semibold">{r.name}</h3>
                        <p className="mt-1 text-xs text-muted-foreground">{r.description}</p>
                        <div className="mt-2 flex items-center gap-3">
                          <span className="text-lg font-bold">{r.estimatedPrice}</span>
                          <Badge variant="secondary" className="text-[10px]">
                            {r.matchPercentage}% Match
                          </Badge>
                        </div>
                        {r.whereToBuy?.length > 0 && (
                          <p className="mt-2 text-[11px] text-muted-foreground">
                            Available at: {r.whereToBuy.join(", ")}
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

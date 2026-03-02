import { useState, useEffect } from "react";
import { FileText, Bot, Settings, Key, Save } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

export default function AdminDashboard() {
  const [geminiKey, setGeminiKey] = useState("");
  const [savedKey, setSavedKey] = useState("");
  const [saving, setSaving] = useState(false);
  const [postCount, setPostCount] = useState(0);
  const [publishedCount, setPublishedCount] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    // Load Gemini key
    getDoc(doc(db, "settings", "gemini")).then((snap) => {
      if (snap.exists()) {
        const key = snap.data().apiKey || "";
        setGeminiKey(key);
        setSavedKey(key);
      }
    });
    // Load real post stats
    getDocs(collection(db, "posts")).then((snap) => {
      setPostCount(snap.size);
      setPublishedCount(snap.docs.filter((d) => d.data().status === "published").length);
    });
  }, []);

  const saveGeminiKey = async () => {
    setSaving(true);
    try {
      await setDoc(doc(db, "settings", "gemini"), { apiKey: geminiKey });
      setSavedKey(geminiKey);
      toast({ title: "Saved", description: "Gemini API key saved securely" });
    } catch {
      toast({ title: "Error", description: "Failed to save API key", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard Overview</h1>
        <p className="text-sm text-muted-foreground">Welcome back. Here's a quick summary.</p>
      </div>

      {/* Live Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Posts</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{postCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Published</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{publishedCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">AI Scout</CardTitle>
            <Bot className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{savedKey ? "Active" : "Not configured"}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {savedKey ? "Gemini API key is set" : "Add API key below"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Gemini API Key Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Key className="h-4 w-4" /> Gemini API Key
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Enter your Google Gemini API key to power the AI Scout feature. Get one at{" "}
            <a href="https://aistudio.google.com/apikey" target="_blank" rel="noopener noreferrer" className="text-primary underline">
              Google AI Studio
            </a>.
          </p>
          <div className="flex gap-3">
            <div className="flex-1 space-y-2">
              <Label>API Key</Label>
              <Input
                type="password"
                value={geminiKey}
                onChange={(e) => setGeminiKey(e.target.value)}
                placeholder="AIzaSy..."
              />
            </div>
            <div className="flex items-end">
              <Button onClick={saveGeminiKey} disabled={saving || geminiKey === savedKey}>
                <Save className="mr-2 h-4 w-4" />
                {saving ? "Saving..." : "Save Key"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

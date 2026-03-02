import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Eye, FileText } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import {
  getAllPosts, createPost, updatePost, deletePost, uploadImage,
  type BlogPostData,
} from "@/lib/blogService";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

const categories = ["Sneaker Culture", "Deal Alerts", "Style Guides", "AI & Tech", "Brand Spotlights", "Reviews"];

const quillModules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ["bold", "italic", "underline", "strike"],
    [{ align: "" }, { align: "center" }, { align: "right" }],
    [{ list: "ordered" }, { list: "bullet" }],
    ["blockquote", "code-block"],
    ["link", "image"],
    ["clean"],
  ],
  clipboard: {
    matchers: [
      [
        Node.ELEMENT_NODE,
        (_node: HTMLElement, delta: any) => {
          delta.ops = delta.ops.map((op: any) => {
            if (op.attributes) {
              delete op.attributes.background;
              delete op.attributes.color;
            }
            return op;
          });
          return delta;
        },
      ],
    ],
  },
};

export default function AdminBlogPosts() {
  const [posts, setPosts] = useState<BlogPostData[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editing, setEditing] = useState<BlogPostData | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const { toast } = useToast();

  // Form state
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [htmlMode, setHtmlMode] = useState(false);
  const [category, setCategory] = useState(categories[0]);
  const [status, setStatus] = useState<"draft" | "published">("draft");
  const [author, setAuthor] = useState("Admin");

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const data = await getAllPosts();
      setPosts(data);
    } catch (err) {
      toast({ title: "Error", description: "Failed to load posts", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPosts(); }, []);

  const resetForm = () => {
    setTitle(""); setExcerpt(""); setContent(""); setCategory(categories[0]);
    setStatus("draft"); setAuthor("Admin"); setImageFile(null); setImagePreview("");
    setEditing(null); setHtmlMode(false); setImageUrl("");
  };

  const openCreate = () => { resetForm(); setDialogOpen(true); };

  const openEdit = (post: BlogPostData) => {
    setEditing(post);
    setTitle(post.title); setExcerpt(post.excerpt); setContent(post.content);
    setCategory(post.category); setStatus(post.status); setAuthor(post.author);
    setImagePreview(post.image); setImageFile(null); setImageUrl(post.image || "");
    setDialogOpen(true);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    if (!title.trim() || !content.trim()) {
      toast({ title: "Validation", description: "Title and content are required", variant: "destructive" });
      return;
    }
    setSaving(true);
    try {
      let finalImageUrl = imageUrl.trim() || editing?.image || "";
      if (imageFile) {
        try {
          finalImageUrl = await uploadImage(imageFile);
        } catch (uploadErr) {
          console.error("Image upload failed:", uploadErr);
          toast({ title: "Upload failed", description: "File upload failed. Using image URL instead.", variant: "destructive" });
          // fallback to manually entered URL
          if (!finalImageUrl) {
            setSaving(false);
            return;
          }
        }
      }

      const postData = { title, excerpt, content, image: finalImageUrl, author, category, status };

      if (editing?.id) {
        await updatePost(editing.id, postData);
        toast({ title: "Updated", description: "Blog post updated successfully" });
      } else {
        await createPost(postData);
        toast({ title: "Created", description: "Blog post created successfully" });
      }

      setDialogOpen(false);
      resetForm();
      fetchPosts();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to save post";
      toast({ title: "Error", description: message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    try {
      await deletePost(deletingId);
      toast({ title: "Deleted", description: "Blog post deleted" });
      setDeleteDialogOpen(false);
      setDeletingId(null);
      fetchPosts();
    } catch {
      toast({ title: "Error", description: "Failed to delete post", variant: "destructive" });
    }
  };

  const confirmDelete = (id: string) => {
    setDeletingId(id);
    setDeleteDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Blog Posts</h1>
          <p className="text-sm text-muted-foreground">Create and manage your blog content</p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="mr-2 h-4 w-4" /> New Post
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            </div>
          ) : posts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <FileText className="mb-3 h-10 w-10" />
              <p className="text-sm">No blog posts yet. Create your first one!</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Author</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {posts.map((post) => (
                  <TableRow key={post.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        {post.image && (
                          <img src={post.image} alt="" className="h-10 w-10 rounded-lg object-cover" />
                        )}
                        <div>
                          <p className="text-sm font-medium line-clamp-1">{post.title}</p>
                          <p className="text-[10px] text-muted-foreground line-clamp-1">{post.excerpt}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="text-[10px]">{post.category}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={post.status === "published" ? "default" : "outline"}
                        className="text-[10px]"
                      >
                        {post.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{post.author}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(post)}>
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => confirmDelete(post.id!)}>
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Post" : "Create New Post"}</DialogTitle>
            <DialogDescription>
              {editing ? "Update your blog post details below." : "Fill in the details for your new blog post."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Title</Label>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Post title..." />
            </div>
            <div className="space-y-2">
              <Label>Excerpt</Label>
              <Textarea value={excerpt} onChange={(e) => setExcerpt(e.target.value)} placeholder="Short summary..." rows={2} />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Category</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {categories.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={status} onValueChange={(v) => setStatus(v as "draft" | "published")}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Author</Label>
                <Input value={author} onChange={(e) => setAuthor(e.target.value)} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Featured Image</Label>
              <Input type="file" accept="image/*" onChange={handleImageChange} />
              <p className="text-xs text-muted-foreground">Or paste an image URL below:</p>
              <Input
                type="url"
                placeholder="https://example.com/image.jpg"
                value={imageUrl}
                onChange={(e) => { setImageUrl(e.target.value); if (!imageFile) setImagePreview(e.target.value); }}
              />
              {imagePreview && (
                <img src={imagePreview} alt="Preview" className="mt-2 h-32 w-full rounded-lg object-cover" />
              )}
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Content</Label>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="text-xs h-7"
                  onClick={() => setHtmlMode(!htmlMode)}
                >
                  {htmlMode ? "Rich Editor" : "Edit HTML"}
                </Button>
              </div>
              {htmlMode ? (
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="flex min-h-[300px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-mono ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  placeholder="<h2>Your HTML content...</h2>"
                />
              ) : (
                <div className="rounded-lg border border-input bg-background [&_.ql-toolbar]:border-input [&_.ql-toolbar]:bg-secondary/50 [&_.ql-container]:border-input [&_.ql-editor]:min-h-[200px] [&_.ql-editor]:text-foreground [&_.ql-snow_.ql-stroke]:stroke-foreground [&_.ql-snow_.ql-fill]:fill-foreground [&_.ql-snow_.ql-picker-label]:text-foreground [&_.ql-snow_.ql-picker-options]:bg-popover [&_.ql-snow_.ql-picker-options]:border-border [&_.ql-snow_.ql-picker-item]:text-foreground">
                  <ReactQuill theme="snow" value={content} onChange={setContent} modules={quillModules} />
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? "Saving..." : editing ? "Update Post" : "Create Post"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Post</DialogTitle>
            <DialogDescription>Are you sure? This action cannot be undone.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, User, Calendar, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getPost, BlogPostData } from "@/lib/blogService";
import { CommentSection } from "@/components/CommentSection";
import { format } from "date-fns";

export default function BlogPost() {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<BlogPostData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!id) return;
    getPost(id)
      .then((data) => {
        if (!data) setError(true);
        else setPost(data);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center py-32">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="py-32 text-center">
        <p className="text-muted-foreground mb-4">Post not found.</p>
        <Button variant="outline" asChild>
          <Link to="/blog"><ArrowLeft className="mr-2 h-4 w-4" />Back to Blog</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="py-12">
      <div className="container mx-auto max-w-3xl px-4">
        <Link to="/blog" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors mb-8">
          <ArrowLeft className="h-4 w-4" /> Back to Blog
        </Link>

        {post.category && (
          <Badge variant="secondary" className="mb-4">{post.category}</Badge>
        )}

        <h1 className="text-3xl font-extrabold leading-tight md:text-4xl">{post.title}</h1>

        <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1"><User className="h-4 w-4" />{post.author}</span>
          {post.createdAt && (
            <span className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {format(post.createdAt.toDate(), "MMMM d, yyyy")}
            </span>
          )}
        </div>

        {post.image && (
          <div className="mt-8 overflow-hidden rounded-xl">
            <img src={post.image} alt={post.title} className="w-full object-cover" />
          </div>
        )}

        <article
          className="prose prose-invert mt-10 max-w-full break-words prose-headings:font-bold prose-a:text-primary prose-img:rounded-lg prose-p:mb-4 prose-img:my-8"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {id && <CommentSection postId={id} />}
      </div>
    </div>
  );
}

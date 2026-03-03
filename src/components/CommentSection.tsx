import { useEffect, useState } from "react";
import { MessageSquare, Send, Loader2, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { addComment, getApprovedComments, type Comment } from "@/lib/commentService";
import { format } from "date-fns";

interface Props {
    postId: string;
}

export function CommentSection({ postId }: Props) {
    const [comments, setComments] = useState<Comment[]>([]);
    const [loading, setLoading] = useState(true);
    const [name, setName] = useState("");
    const [text, setText] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const fetchComments = () => {
        getApprovedComments(postId)
            .then(setComments)
            .catch(() => { })
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchComments();
    }, [postId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim() || !text.trim()) {
            toast.error("Please fill in both your name and comment.");
            return;
        }
        setSubmitting(true);
        try {
            await addComment(postId, name, text);
            toast.success("Comment submitted! It will appear after approval.");
            setName("");
            setText("");
        } catch {
            toast.error("Failed to submit comment. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <section className="mt-16 border-t border-border pt-10">
            <h2 className="flex items-center gap-2 text-xl font-bold mb-8">
                <MessageSquare className="h-5 w-5 text-primary" />
                Comments {!loading && comments.length > 0 && `(${comments.length})`}
            </h2>

            {/* ── Approved comments ─────────────────── */}
            {loading ? (
                <div className="flex justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
            ) : comments.length === 0 ? (
                <p className="text-muted-foreground text-sm mb-10">No comments yet. Be the first to share your thoughts!</p>
            ) : (
                <div className="space-y-6 mb-10">
                    {comments.map((c) => (
                        <div key={c.id} className="rounded-xl bg-card/60 border border-border p-5">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20">
                                    <User className="h-4 w-4 text-primary" />
                                </div>
                                <span className="font-semibold text-sm">{c.name}</span>
                                <span className="text-xs text-muted-foreground ml-auto">
                                    {c.createdAt && format(c.createdAt.toDate(), "MMM d, yyyy 'at' h:mm a")}
                                </span>
                            </div>
                            <p className="text-sm text-foreground/90 leading-relaxed whitespace-pre-wrap">{c.text}</p>
                        </div>
                    ))}
                </div>
            )}

            {/* ── Comment form ──────────────────────── */}
            <div className="rounded-xl bg-card/40 border border-border p-6">
                <h3 className="font-semibold mb-4">Leave a Comment</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Input
                            placeholder="Your name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            maxLength={50}
                            className="bg-background"
                        />
                    </div>
                    <div>
                        <Textarea
                            placeholder="Write your comment..."
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            rows={4}
                            maxLength={1000}
                            className="bg-background resize-none"
                        />
                    </div>
                    <Button type="submit" disabled={submitting} className="gap-2">
                        {submitting ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <Send className="h-4 w-4" />
                        )}
                        {submitting ? "Submitting…" : "Post Comment"}
                    </Button>
                </form>
            </div>
        </section>
    );
}

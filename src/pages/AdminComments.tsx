import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, CheckCircle, Trash2, MessageSquare } from "lucide-react";
import { toast } from "sonner";
import { getAllComments, approveComment, deleteComment, type Comment } from "@/lib/commentService";
import { format } from "date-fns";

export default function AdminComments() {
    const [comments, setComments] = useState<Comment[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchComments = () => {
        setLoading(true);
        getAllComments()
            .then(setComments)
            .catch(() => toast.error("Failed to load comments"))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchComments();
    }, []);

    const handleApprove = async (id: string) => {
        try {
            await approveComment(id);
            toast.success("Comment approved!");
            setComments((prev) =>
                prev.map((c) => (c.id === id ? { ...c, approved: true } : c))
            );
        } catch {
            toast.error("Failed to approve comment");
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await deleteComment(id);
            toast.success("Comment deleted");
            setComments((prev) => prev.filter((c) => c.id !== id));
        } catch {
            toast.error("Failed to delete comment");
        }
    };

    const pending = comments.filter((c) => !c.approved);
    const approved = comments.filter((c) => c.approved);

    if (loading) {
        return (
            <div className="flex justify-center py-32">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    return (
        <div className="space-y-6 p-6 font-admin">
            <div>
                <h1 className="text-2xl font-bold">Comment Moderation</h1>
                <p className="text-muted-foreground text-sm mt-1">
                    {pending.length} pending · {approved.length} approved
                </p>
            </div>

            {/* ── Pending ─────── */}
            {pending.length > 0 && (
                <Card className="border-warning/30">
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <MessageSquare className="h-5 w-5 text-warning" />
                            Pending Approval ({pending.length})
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {pending.map((c) => (
                            <CommentRow
                                key={c.id}
                                comment={c}
                                onApprove={() => handleApprove(c.id)}
                                onDelete={() => handleDelete(c.id)}
                            />
                        ))}
                    </CardContent>
                </Card>
            )}

            {/* ── Approved ─────── */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-success" />
                        Approved ({approved.length})
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {approved.length === 0 ? (
                        <p className="text-muted-foreground text-sm">No approved comments yet.</p>
                    ) : (
                        approved.map((c) => (
                            <CommentRow
                                key={c.id}
                                comment={c}
                                onDelete={() => handleDelete(c.id)}
                            />
                        ))
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

function CommentRow({
    comment: c,
    onApprove,
    onDelete,
}: {
    comment: Comment;
    onApprove?: () => void;
    onDelete: () => void;
}) {
    return (
        <div className="flex flex-col gap-2 rounded-lg border border-border bg-card/60 p-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-sm">{c.name}</span>
                    <Badge variant={c.approved ? "default" : "secondary"} className="text-xs">
                        {c.approved ? "Approved" : "Pending"}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                        on post: {c.postId.slice(0, 8)}…
                    </span>
                </div>
                <p className="mt-1 text-sm text-foreground/80 whitespace-pre-wrap break-words">{c.text}</p>
                <span className="text-xs text-muted-foreground mt-1 block">
                    {c.createdAt && format(c.createdAt.toDate(), "MMM d, yyyy 'at' h:mm a")}
                </span>
            </div>
            <div className="flex items-center gap-2 shrink-0 mt-2 sm:mt-0">
                {onApprove && (
                    <Button size="sm" variant="outline" className="text-success border-success/30 hover:bg-success/10" onClick={onApprove}>
                        <CheckCircle className="mr-1 h-4 w-4" /> Approve
                    </Button>
                )}
                <Button size="sm" variant="outline" className="text-destructive border-destructive/30 hover:bg-destructive/10" onClick={onDelete}>
                    <Trash2 className="mr-1 h-4 w-4" /> Delete
                </Button>
            </div>
        </div>
    );
}

import {
    collection, addDoc, query, where, orderBy, getDocs,
    doc, updateDoc, deleteDoc, Timestamp, getDoc,
} from "firebase/firestore";
import { db } from "./firebase";

export interface Comment {
    id: string;
    postId: string;
    name: string;
    text: string;
    createdAt: Timestamp;
    approved: boolean;
}

const COL = collection(db, "comments");

/** Public: add a new pending comment */
export async function addComment(postId: string, name: string, text: string) {
    await addDoc(COL, {
        postId,
        name: name.trim(),
        text: text.trim(),
        createdAt: Timestamp.now(),
        approved: false,
    });
}

/** Public: get approved comments for a specific post */
export async function getApprovedComments(postId: string): Promise<Comment[]> {
    const q = query(
        COL,
        where("postId", "==", postId),
    );
    const snap = await getDocs(q);
    return snap.docs
        .map((d) => ({ id: d.id, ...d.data() } as Comment))
        .filter((c) => c.approved)
        .sort((a, b) => b.createdAt.seconds - a.createdAt.seconds);
}

/** Admin: get ALL comments (pending + approved), newest first */
export async function getAllComments(): Promise<Comment[]> {
    const q = query(COL, orderBy("createdAt", "desc"));
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Comment));
}

/** Admin: approve a comment */
export async function approveComment(id: string) {
    await updateDoc(doc(db, "comments", id), { approved: true });
}

/** Admin: delete a comment */
export async function deleteComment(id: string) {
    await deleteDoc(doc(db, "comments", id));
}

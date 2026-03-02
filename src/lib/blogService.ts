import {
  collection, doc, getDocs, getDoc, addDoc, updateDoc, deleteDoc,
  query, where, orderBy, Timestamp, serverTimestamp,
} from "firebase/firestore";
import { db } from "./firebase";
import { uploadToR2, deleteFromR2 } from "./r2Upload";

export interface BlogPostData {
  id?: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  author: string;
  category: string;
  status: "draft" | "published";
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

const POSTS_COL = "posts";

export async function getPublishedPosts(): Promise<BlogPostData[]> {
  const q = query(
    collection(db, POSTS_COL),
    where("status", "==", "published")
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as BlogPostData));
}

export async function getAllPosts(): Promise<BlogPostData[]> {
  const q = query(collection(db, POSTS_COL), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as BlogPostData));
}

export async function getPost(id: string): Promise<BlogPostData | null> {
  const snap = await getDoc(doc(db, POSTS_COL, id));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() } as BlogPostData;
}

export async function createPost(data: Omit<BlogPostData, "id" | "createdAt" | "updatedAt">) {
  return addDoc(collection(db, POSTS_COL), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function updatePost(id: string, data: Partial<BlogPostData>) {
  return updateDoc(doc(db, POSTS_COL, id), {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

export async function deletePost(id: string) {
  return deleteDoc(doc(db, POSTS_COL, id));
}

export async function uploadImage(file: File): Promise<string> {
  return uploadToR2(file);
}

export async function deleteImage(url: string) {
  try {
    await deleteFromR2(url);
  } catch {
    // Image may not exist; ignore
  }
}


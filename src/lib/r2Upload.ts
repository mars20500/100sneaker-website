/**
 * R2 Image Upload Service
 *
 * Change WORKER_URL to your deployed Cloudflare Worker URL.
 * Set UPLOAD_SECRET if you configured auth on the worker.
 */

// Deployed Cloudflare Worker URL
const WORKER_URL = "https://100sneaker.tak-badr50.workers.dev";

// Optional: set this if you added UPLOAD_SECRET to the Worker
const UPLOAD_SECRET = "";

export async function uploadToR2(file: File): Promise<string> {
    const formData = new FormData();
    formData.append("file", file);

    const headers: HeadersInit = {};
    if (UPLOAD_SECRET) {
        headers["Authorization"] = `Bearer ${UPLOAD_SECRET}`;
    }

    const res = await fetch(`${WORKER_URL}/upload`, {
        method: "POST",
        body: formData,
        headers,
    });

    if (!res.ok) {
        const err = await res.json().catch(() => ({ error: "Upload failed" }));
        throw new Error((err as { error?: string }).error || "Upload failed");
    }

    const data = (await res.json()) as { url: string; key: string };
    return data.url;
}

export async function deleteFromR2(imageUrl: string): Promise<void> {
    // Extract key from URL like https://worker.dev/images/12345_photo.png
    const key = imageUrl.split("/images/").pop();
    if (!key) return;

    const headers: HeadersInit = {};
    if (UPLOAD_SECRET) {
        headers["Authorization"] = `Bearer ${UPLOAD_SECRET}`;
    }

    await fetch(`${WORKER_URL}/images/${key}`, {
        method: "DELETE",
        headers,
    });
}

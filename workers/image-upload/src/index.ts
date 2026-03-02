/**
 * Cloudflare Worker — Image Upload API for 100 Sneaker
 *
 * Endpoints:
 *   POST /upload          — Upload an image (multipart/form-data, field: "file")
 *   GET  /images/:key     — Serve an image from R2
 *   DELETE /images/:key   — Delete an image from R2
 *
 * Auth: Set UPLOAD_SECRET as a Worker secret. Send it as
 *       Authorization: Bearer <secret> on POST/DELETE requests.
 */

interface Env {
    IMAGES: R2Bucket;
    CORS_ORIGIN: string;
    UPLOAD_SECRET?: string;
    PUBLIC_URL: string; // e.g. https://pub-xxx.r2.dev
}

function corsHeaders(origin: string): HeadersInit {
    return {
        "Access-Control-Allow-Origin": origin,
        "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
    };
}

function unauthorized(origin: string): Response {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json", ...corsHeaders(origin) },
    });
}

export default {
    async fetch(request: Request, env: Env): Promise<Response> {
        const origin = env.CORS_ORIGIN || "*";
        const url = new URL(request.url);

        // Handle CORS preflight
        if (request.method === "OPTIONS") {
            return new Response(null, { status: 204, headers: corsHeaders(origin) });
        }

        // ── POST /upload ──────────────────────────────────────
        if (request.method === "POST" && url.pathname === "/upload") {
            // Auth check
            if (env.UPLOAD_SECRET) {
                const auth = request.headers.get("Authorization");
                if (auth !== `Bearer ${env.UPLOAD_SECRET}`) {
                    return unauthorized(origin);
                }
            }

            try {
                const formData = await request.formData();
                const file = formData.get("file") as File | null;

                if (!file) {
                    return new Response(JSON.stringify({ error: "No file provided" }), {
                        status: 400,
                        headers: { "Content-Type": "application/json", ...corsHeaders(origin) },
                    });
                }

                // Generate a unique key
                const ext = file.name.split(".").pop()?.toLowerCase() || "png";
                const safeName = file.name.replace(/\s+/g, "-").replace(/[^a-zA-Z0-9._-]/g, "").toLowerCase();
                const key = `${Date.now()}_${safeName}`;

                // Upload to R2
                await env.IMAGES.put(key, file.stream(), {
                    httpMetadata: {
                        contentType: file.type || `image/${ext}`,
                    },
                });

                // Return the public URL (served directly from R2)
                const publicBase = env.PUBLIC_URL || url.origin + "/images";
                const imageUrl = `${publicBase}/${key}`;
                return new Response(JSON.stringify({ url: imageUrl, key }), {
                    status: 200,
                    headers: { "Content-Type": "application/json", ...corsHeaders(origin) },
                });
            } catch (err) {
                return new Response(JSON.stringify({ error: "Upload failed" }), {
                    status: 500,
                    headers: { "Content-Type": "application/json", ...corsHeaders(origin) },
                });
            }
        }

        // ── GET /images/:key ──────────────────────────────────
        if (request.method === "GET" && url.pathname.startsWith("/images/")) {
            const key = url.pathname.replace("/images/", "");
            const object = await env.IMAGES.get(key);

            if (!object) {
                return new Response("Not found", { status: 404, headers: corsHeaders(origin) });
            }

            return new Response(object.body, {
                headers: {
                    "Content-Type": object.httpMetadata?.contentType || "image/png",
                    "Cache-Control": "public, max-age=31536000, immutable",
                    ...corsHeaders(origin),
                },
            });
        }

        // ── DELETE /images/:key ───────────────────────────────
        if (request.method === "DELETE" && url.pathname.startsWith("/images/")) {
            // Auth check
            if (env.UPLOAD_SECRET) {
                const auth = request.headers.get("Authorization");
                if (auth !== `Bearer ${env.UPLOAD_SECRET}`) {
                    return unauthorized(origin);
                }
            }

            const key = url.pathname.replace("/images/", "");
            await env.IMAGES.delete(key);
            return new Response(JSON.stringify({ deleted: key }), {
                status: 200,
                headers: { "Content-Type": "application/json", ...corsHeaders(origin) },
            });
        }

        // ── Fallback ──────────────────────────────────────────
        return new Response("100 Sneaker Image API", {
            status: 200,
            headers: { "Content-Type": "text/plain", ...corsHeaders(origin) },
        });
    },
};

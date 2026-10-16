import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Headers": "authorization, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const encoder = new TextEncoder();

async function sha256(value: string) {
  const bytes = await crypto.subtle.digest("SHA-256", encoder.encode(value));
  return Array.from(new Uint8Array(bytes), (byte) =>
    byte.toString(16).padStart(2, "0"),
  ).join("");
}

Deno.serve(async (request) => {
  const allowedOrigin = Deno.env.get("RATING_ALLOWED_ORIGIN");
  const origin = request.headers.get("origin");
  if (!allowedOrigin || origin !== allowedOrigin) {
    return new Response("Forbidden", { status: 403 });
  }

  const headers = { ...corsHeaders, "Access-Control-Allow-Origin": allowedOrigin };
  if (request.method === "OPTIONS") return new Response("ok", { headers });
  if (request.method !== "POST") return new Response("Method not allowed", { status: 405, headers });

  try {
    const body: unknown = await request.json();
    if (!body || typeof body !== "object") throw new Error("Invalid request");
    const { rating, comment } = body as { rating?: unknown; comment?: unknown };
    if (!Number.isInteger(rating) || typeof comment !== "string") {
      throw new Error("Invalid request");
    }

    const forwardedFor = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
    const userAgent = request.headers.get("user-agent") ?? "unknown";
    const salt = Deno.env.get("RATING_FINGERPRINT_SALT");
    if (!salt) throw new Error("Server is not configured");
    const fingerprint = await sha256(`${salt}:${forwardedFor}:${userAgent}`);

    const admin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    );
    const { error } = await admin.rpc("submit_rating", {
      p_rating: rating,
      p_comment: comment.trim(),
      p_fingerprint: fingerprint,
    });
    if (error?.code === "P0001") {
      return new Response("Too many submissions", { status: 429, headers });
    }
    if (error) throw error;
    return new Response(null, { status: 204, headers });
  } catch (error) {
    console.error("Rating submission rejected", error);
    return new Response("Invalid feedback", { status: 400, headers });
  }
});

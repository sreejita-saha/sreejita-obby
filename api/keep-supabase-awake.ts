/**
 * Vercel invokes this route once a day. It performs a tiny authenticated query
 * so the Supabase Free project has regular database activity.
 */
export async function GET(request: Request) {
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret || request.headers.get("authorization") !== `Bearer ${cronSecret}`) {
    return new Response("Unauthorized", { status: 401 });
  }

  const supabaseUrl = process.env.SUPABASE_URL?.replace(/\/$/, "");
  const secretKey = process.env.SUPABASE_SECRET_KEY;
  if (!supabaseUrl || !secretKey) {
    console.error("Supabase keep-alive is not configured");
    return new Response("Server configuration error", { status: 500 });
  }

  try {
    const response = await fetch(`${supabaseUrl}/rest/v1/ratings?select=id&limit=1`, {
      headers: {
        apikey: secretKey,
        Authorization: `Bearer ${secretKey}`,
      },
      cache: "no-store",
    });

    if (!response.ok) {
      console.error("Supabase keep-alive failed", response.status);
      return new Response("Supabase request failed", { status: 502 });
    }

    return Response.json(
      { ok: true },
      {
        headers: { "Cache-Control": "no-store" },
      },
    );
  } catch (error) {
    console.error("Supabase keep-alive request failed", error);
    return new Response("Supabase request failed", { status: 502 });
  }
}

import { afterEach, describe, expect, it, vi } from "vitest";
import { submitRating } from "./ratings";

const configuration = { url: "https://example.supabase.co", publishableKey: "public-key" };

describe("submitRating", () => {
  afterEach(() => vi.unstubAllGlobals());

  it("sends a trimmed rating payload", async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(null, { status: 201 }));
    vi.stubGlobal("fetch", fetchMock);

    await expect(submitRating(configuration, 5, " Great world ")).resolves.toBe("submitted");
    expect(fetchMock).toHaveBeenCalledWith(
      "https://example.supabase.co/functions/v1/submit-rating",
      expect.objectContaining({ body: JSON.stringify({ rating: 5, comment: "Great world" }) }),
    );
  });

  it("reports rate limits without treating them as transport failures", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(null, { status: 429 })));
    await expect(submitRating(configuration, 4, "")).resolves.toBe("rate-limited");
  });

  it("fails clearly when public configuration is unavailable", async () => {
    await expect(submitRating({}, 3, "")).rejects.toThrow("Ratings are not configured yet.");
  });
});

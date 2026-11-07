const ratingEndpointSuffix = "/functions/v1/submit-rating";

type RatingConfiguration = {
  url?: string;
  publishableKey?: string;
};

export async function submitRating(
  configuration: RatingConfiguration,
  rating: number,
  comment: string,
): Promise<"submitted" | "rate-limited"> {
  if (!configuration.url || !configuration.publishableKey) {
    throw new Error("Ratings are not configured yet. Please try again later.");
  }

  const response = await fetch(`${configuration.url}${ratingEndpointSuffix}`, {
    method: "POST",
    headers: {
      apikey: configuration.publishableKey,
      Authorization: `Bearer ${configuration.publishableKey}`,
      "Content-Type": "application/json",
      Prefer: "return=minimal",
    },
    body: JSON.stringify({ rating, comment: comment.trim() }),
  });

  if (response.status === 429) return "rate-limited";
  if (!response.ok) throw new Error("Rating request failed");
  return "submitted";
}

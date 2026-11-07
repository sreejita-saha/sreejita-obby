import type { ChatSource } from "../components/chat/chat.types";

type ChatResponse = {
  answer?: string;
  sources?: ChatSource[];
  error?: string;
};

export class ChatRequestError extends Error {
  readonly isRateLimited: boolean;

  constructor(message: string, isRateLimited = false) {
    super(message);
    this.name = "ChatRequestError";
    this.isRateLimited = isRateLimited;
  }
}

function parseResponse(body: string): ChatResponse {
  try {
    return JSON.parse(body) as ChatResponse;
  } catch {
    throw new ChatRequestError("The chat service is temporarily unavailable.");
  }
}

export async function askPortfolioAssistant(
  question: string,
  signal: AbortSignal,
): Promise<{ answer: string; sources?: ChatSource[] }> {
  const response = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question }),
    signal,
  });
  const payload = parseResponse(await response.text());

  if (!response.ok) {
    throw new ChatRequestError(
      payload.error || "The assistant could not answer just now.",
      response.status === 429,
    );
  }

  return {
    answer: payload.answer || "I could not generate an answer just now.",
    sources: payload.sources,
  };
}

import { afterEach, describe, expect, it, vi } from "vitest";
import { askPortfolioAssistant, ChatRequestError } from "./chat";

describe("askPortfolioAssistant", () => {
  afterEach(() => vi.unstubAllGlobals());

  it("posts the question and returns a complete assistant response", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ answer: "I built this.", sources: [] }), { status: 200 }),
    );
    vi.stubGlobal("fetch", fetchMock);

    await expect(askPortfolioAssistant("What did you build?", new AbortController().signal)).resolves.toEqual({
      answer: "I built this.",
      sources: [],
    });
    expect(fetchMock).toHaveBeenCalledWith(
      "/api/chat",
      expect.objectContaining({ method: "POST" }),
    );
  });

  it("maps rate limiting to a typed error", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(new Response(JSON.stringify({ error: "Try later" }), { status: 429 })),
    );

    await expect(askPortfolioAssistant("Hello", new AbortController().signal)).rejects.toMatchObject({
      name: "ChatRequestError",
      message: "Try later",
      isRateLimited: true,
    } satisfies Partial<ChatRequestError>);
  });

  it("rejects malformed server responses", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response("not json", { status: 200 })));

    await expect(askPortfolioAssistant("Hello", new AbortController().signal)).rejects.toThrow(
      "The chat service is temporarily unavailable.",
    );
  });
});

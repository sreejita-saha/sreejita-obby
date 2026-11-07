import { GoogleGenAI } from "@google/genai";
import { createClient } from "@supabase/supabase-js";
import { createHash } from "node:crypto";

const rateLimitMaxRequests = 10;
const rateLimitWindowSeconds = 60 * 60;
const outOfTokensMessage = "Oops sorry, I am out of tokens, sorry about that :P";

function isQuotaError(error: unknown) {
  const message = error instanceof Error ? error.message : String(error);
  return /resource[_ ]exhausted|quota|token limit|rate limit|status.?429|\b429\b/i.test(message);
}

type PortfolioChunk = {
  title: string;
  source: string;
  content: string;
  similarity: number;
  metadata: {
    section?: string;
  };
};

function createClientFingerprint(request: Request, salt: string) {
  const forwardedFor =
    request.headers.get("x-forwarded-for") ??
    request.headers.get("x-real-ip") ??
    "unknown";
  const clientIp = forwardedFor.split(",")[0].trim();

  return createHash("sha256")
    .update(`${salt}:${clientIp}`)
    .digest("hex");
}

export async function POST(request: Request) {
  try {
    const { question } = await request.json();

    if (typeof question !== "string" || question.trim().length === 0) {
      return Response.json(
        { error: "Please provide a question." },
        { status: 400 },
      );
    }

    if (question.length > 500) {
      return Response.json(
        { error: "Questions must be 500 characters or fewer." },
        { status: 400 },
      );
    }

    const geminiApiKey = process.env.GEMINI_API_KEY;
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY;
    const rateLimitSalt = process.env.CHAT_RATE_LIMIT_SALT;

    if (!geminiApiKey || !supabaseUrl || !supabaseSecretKey || !rateLimitSalt) {
      console.error("Chat API is missing server environment variables.");
      return Response.json(
        { error: "The chat service is not configured." },
        { status: 500 },
      );
    }

    const ai = new GoogleGenAI({ apiKey: geminiApiKey });
    const supabase = createClient(supabaseUrl, supabaseSecretKey);

    const { data: allowed, error: rateLimitError } = await supabase.rpc(
      "check_chat_rate_limit",
      {
        p_fingerprint: createClientFingerprint(request, rateLimitSalt),
        p_limit: rateLimitMaxRequests,
        p_window_seconds: rateLimitWindowSeconds,
      },
    );

    if (rateLimitError) throw rateLimitError;

    if (!allowed) {
      return Response.json(
        { error: outOfTokensMessage },
        {
          status: 429,
          headers: { "Retry-After": String(rateLimitWindowSeconds) },
        },
      );
    }

    const embeddingResponse = await ai.models.embedContent({
      model: "gemini-embedding-2",
      contents: question,
      config: {
        taskType: "RETRIEVAL_QUERY",
        outputDimensionality: 768,
      },
    });

    const queryEmbedding = embeddingResponse.embeddings[0]?.values;

    if (!queryEmbedding) {
      throw new Error("Gemini did not return a query embedding.");
    }

    const { data, error } = await supabase.rpc("match_portfolio_chunks", {
      query_embedding: queryEmbedding,
      match_count: 4,
    });

    if (error) throw error;

    const chunks = (data ?? []) as PortfolioChunk[];

    const context = chunks
      .map(
        (chunk, index) =>
          `[Source ${index + 1}: ${chunk.title} | ${chunk.source}]\n${chunk.content}`,
      )
      .join("\n\n---\n\n");

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash-lite",
      contents: `Visitor question: ${question}\n\nPortfolio context:\n${context}`,
      config: {
        systemInstruction: `
You are Sreejita Saha's portfolio assistant. Speak as Sreejita in the first person: use wording such as "I built", "I worked on", and "my experience". Never describe Sreejita in the third person.

Answer only from the supplied portfolio context.
If a question is unrelated to my portfolio (for example, live news, today's date, weather, or general trivia), say: "I can only help with questions about my portfolio, projects, experience, education, and skills."
If the context does not contain a portfolio answer, say that you do not have that detail.
Do not invent skills, dates, achievements, links, or personal information.
Be concise, friendly, and professional.
Do not mention "the context", "retrieval", or "sources" in the answer.
        `.trim(),
        thinkingConfig: { thinkingLevel: "minimal" },
        temperature: 0.2,
        maxOutputTokens: 220,
      },
    });

    return Response.json({
      answer:
        response.text?.trim() ||
        "I could not generate an answer from the available portfolio information.",
      sources: chunks.map(({ title, source, similarity, metadata }) => ({
        title,
        source,
        similarity,
        metadata,
      })),
    });
  } catch (error) {
    console.error("Chat request failed:", error);

    return Response.json(
      {
        error: isQuotaError(error)
          ? outOfTokensMessage
          : "The chat service is temporarily unavailable.",
      },
      { status: isQuotaError(error) ? 429 : 500 },
    );
  }
}

import { GoogleGenAI } from "@google/genai";
import { createClient } from "@supabase/supabase-js";

type PortfolioChunk = {
  title: string;
  source: string;
  content: string;
  similarity: number;
};

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

    if (!geminiApiKey || !supabaseUrl || !supabaseSecretKey) {
      console.error("Chat API is missing server environment variables.");
      return Response.json(
        { error: "The chat service is not configured." },
        { status: 500 },
      );
    }

    const ai = new GoogleGenAI({ apiKey: geminiApiKey });
    const supabase = createClient(supabaseUrl, supabaseSecretKey);

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
      model: "gemini-3.1-flash-lite",
      contents: `Visitor question: ${question}\n\nPortfolio context:\n${context}`,
      config: {
        systemInstruction: `
You are Sreejita Saha's portfolio assistant.

Answer only from the supplied portfolio context.
If the context does not contain the answer, say that you do not have that detail.
Do not invent skills, dates, achievements, links, or personal information.
Be concise, friendly, and professional.
Do not mention "the context", "retrieval", or "sources" in the answer.
        `.trim(),
        temperature: 0.2,
        maxOutputTokens: 350,
      },
    });

    return Response.json({
      answer:
        response.text?.trim() ||
        "I could not generate an answer from the available portfolio information.",
      sources: chunks.map(({ title, source, similarity }) => ({
        title,
        source,
        similarity,
      })),
    });
  } catch (error) {
    console.error("Chat request failed:", error);

    return Response.json(
      { error: "The chat service is temporarily unavailable." },
      { status: 500 },
    );
  }
}
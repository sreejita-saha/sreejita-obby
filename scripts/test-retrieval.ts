import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { createClient } from "@supabase/supabase-js";

dotenv.config({ path: ".env.local" });

const question =
  process.argv.slice(2).join(" ") ||
  "What systems programming experience does Sreejita have?";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.SUPABASE_SECRET_KEY!,
);

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
  throw new Error("Gemini did not return an embedding for the question.");
}

const { data, error } = await supabase.rpc("match_portfolio_chunks", {
  query_embedding: queryEmbedding,
  match_count: 4,
});

if (error) throw error;

console.log(`\nQuestion: ${question}\n`);
console.table(
  data.map((chunk) => ({
    title: chunk.title,
    source: chunk.source,
    similarity: Number(chunk.similarity).toFixed(3),
  })),
);

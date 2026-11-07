import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { GoogleGenAI } from "@google/genai";
import { createClient } from "@supabase/supabase-js";

const dataDirectory = path.resolve("data");

const geminiApiKey = process.env.GEMINI_API_KEY;
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY;

if (!geminiApiKey || !supabaseUrl || !supabaseSecretKey) {
  throw new Error("Missing GEMINI_API_KEY, VITE_SUPABASE_URL, or SUPABASE_SECRET_KEY.");
}

const ai = new GoogleGenAI({ apiKey: geminiApiKey });
const supabase = createClient(supabaseUrl, supabaseSecretKey);

type Chunk = {
  chunkKey: string;
  content: string;
  source: string;
  title: string;
  metadata: Record<string, string>;
};

function chunkMarkdown(source: string, markdown: string): Chunk[] {
  const chunks: Chunk[] = [];
  let section = "";
  let title = "";
  let body: string[] = [];

  const saveChunk = () => {
    const text = body.join("\n").trim();

    if (!title || !text) return;

    // projects.md contains the fuller versions of these entries, so avoid
    // retrieving the shorter duplicates from cv.md.
    if (source === "cv.md" && section === "Selected Projects") return;

    const chunkKey = `${source}:${section}:${title}`
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-");

    chunks.push({
      chunkKey,
      content: [
        section !== title ? `Section: ${section}` : "",
        `Title: ${title}`,
        text,
      ].filter(Boolean).join("\n\n"),
      source,
      title,
      metadata: {
        documentType: source.replace(".md", ""),
        section,
      },
    });
  };

  for (const line of markdown.split("\n")) {
    const heading = line.match(/^(##|###) (.+)$/);

    if (!heading) {
      body.push(line);
      continue;
    }

    saveChunk();
    body = [];
    title = heading[2].trim();

    if (heading[1] === "##") {
      section = title;
    }
  }

  saveChunk();
  return chunks;
}

async function indexPortfolio() {
  const fileNames = (await readdir(dataDirectory))
    .filter((fileName) => fileName.endsWith(".md"));

  const chunks = (
    await Promise.all(
      fileNames.map(async (fileName) => {
        const markdown = await readFile(path.join(dataDirectory, fileName), "utf8");
        return chunkMarkdown(fileName, markdown);
      }),
    )
  ).flat();

  console.log(`Prepared ${chunks.length} chunks.`);

  const rows = [];

  for (const [index, chunk] of chunks.entries()) {
    console.log(`Embedding ${index + 1}/${chunks.length}: ${chunk.title}`);

    const response = await ai.models.embedContent({
      model: "gemini-embedding-2",
      contents: chunk.content,
      config: {
        taskType: "RETRIEVAL_DOCUMENT",
        outputDimensionality: 768,
      },
    });

    const embedding = response.embeddings[0]?.values;

    if (!embedding || embedding.length !== 768) {
      throw new Error(`Gemini returned an invalid embedding for "${chunk.title}".`);
    }

    rows.push({
      chunk_key: chunk.chunkKey,
      content: chunk.content,
      source: chunk.source,
      title: chunk.title,
      metadata: chunk.metadata,
      embedding,
    });
  }

  const { error } = await supabase
    .from("portfolio_chunks")
    .upsert(rows, { onConflict: "chunk_key" });

  if (error) throw error;

  console.log(`Indexed ${rows.length} chunks successfully.`);
}

indexPortfolio().catch((error) => {
  console.error(error);
  process.exit(1);
});

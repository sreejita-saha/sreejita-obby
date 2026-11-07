export type ChatSource = {
  title: string;
  source: string;
  similarity: number;
  metadata?: { section?: string };
};

export type ChatMessage = {
  role: "assistant" | "user";
  text: string;
  sources?: ChatSource[];
};

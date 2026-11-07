import dotenv from "dotenv";
import { POST } from "../api/chat.ts";

dotenv.config({ path: ".env.local" });

const question =
  process.argv.slice(2).join(" ") ||
  "What experience does Sreejita have with encryption?";

const response = await POST(
  new Request("http://localhost/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question }),
  }),
);

console.log(await response.json());

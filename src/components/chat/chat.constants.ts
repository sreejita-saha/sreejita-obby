import type { ChatMessage } from "./chat.types";

export const STARTER_CHAT_MESSAGE: ChatMessage = {
  role: "assistant",
  text: "Hi! You can ask me about my projects, experience, education, or skills.",
};

export const OUT_OF_TOKENS_MESSAGE =
  "Oops sorry, I am out of tokens, sorry about that :P";

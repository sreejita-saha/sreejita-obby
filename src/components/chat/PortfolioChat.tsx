import { useCallback, useEffect, useRef, useState } from "react";
import { OPEN_PORTFOLIO_CHAT_EVENT } from "../../config/events";
import { OUT_OF_TOKENS_MESSAGE, STARTER_CHAT_MESSAGE } from "./chat.constants";
import type { ChatMessage } from "./chat.types";
import { askPortfolioAssistant } from "../../services/chat";
import { ChatComposer, MAX_QUESTION_LENGTH } from "./ChatComposer";
import { ChatMessageRow } from "./ChatMessageRow";
import "../../styles/chat/PortfolioChat.css";

type PortfolioChatProps = {
  onOpenSection: (sectionId: string) => void;
};

export function PortfolioChat({ onOpenSection }: PortfolioChatProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([STARTER_CHAT_MESSAGE]);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState("");
  const messageListRef = useRef<HTMLDivElement>(null);
  const questionInputRef = useRef<HTMLTextAreaElement>(null);

  const closeChat = useCallback(() => {
    if (isClosing) return;
    setIsClosing(true);
    window.setTimeout(() => {
      setIsOpen(false);
      setIsClosing(false);
    }, 220);
  }, [isClosing]);

  useEffect(() => {
    if (!isOpen) return;

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeChat();
    };

    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [closeChat, isOpen]);

  useEffect(() => {
    const openChat = () => {
      setIsClosing(false);
      setIsOpen(true);
    };
    window.addEventListener(OPEN_PORTFOLIO_CHAT_EVENT, openChat);
    return () => window.removeEventListener(OPEN_PORTFOLIO_CHAT_EVENT, openChat);
  }, []);

  useEffect(() => {
    messageListRef.current?.scrollTo({
      top: messageListRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, isSending]);

  // Keep the conversation flowing: after a response the visitor can type the
  // next question immediately, without clicking back into the text field.
  useEffect(() => {
    if (!isOpen || isClosing || isSending) return;
    const frame = window.requestAnimationFrame(() => questionInputRef.current?.focus());
    return () => window.cancelAnimationFrame(frame);
  }, [isClosing, isOpen, isSending]);

  const sendQuestion = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedQuestion = question.trim();
    if (!trimmedQuestion || isSending) return;

    setQuestion("");
    setError("");
    setIsSending(true);
    setMessages((current) => [...current, { role: "user", text: trimmedQuestion }]);

    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), 25_000);

    try {
      const payload = await askPortfolioAssistant(trimmedQuestion, controller.signal);

      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          text: payload.answer,
          sources: payload.sources,
        },
      ]);
    } catch (requestError) {
      const message =
        requestError instanceof DOMException && requestError.name === "AbortError"
          ? "That took too long. Please try again in a moment."
          : requestError instanceof Error
            ? requestError.message
            : "The assistant could not answer just now.";

      if (message === OUT_OF_TOKENS_MESSAGE) {
        setMessages((current) => [
          ...current,
          { role: "assistant", text: OUT_OF_TOKENS_MESSAGE },
        ]);
      } else {
        setError(message);
      }
    } finally {
      window.clearTimeout(timeoutId);
      setIsSending(false);
    }
  };

  return (
    <div className="portfolio-chat">
      {isOpen && (
        <section
          className={`portfolio-chat__panel ui-panel${isClosing ? " is-closing" : ""}`}
          aria-labelledby="portfolio-chat-title"
        >
          <header className="portfolio-chat__header">
            <div className="portfolio-chat__title">
              <p className="eyebrow">Noob Ai</p>
              <h2 id="portfolio-chat-title">Ask Sreejita</h2>
            </div>
            <button
              className="portfolio-chat__close"
              type="button"
              onClick={closeChat}
              aria-label="Close portfolio assistant"
            >
              ×
            </button>
          </header>

          <div
            ref={messageListRef}
            className="portfolio-chat__messages"
            aria-live="polite"
          >
            {messages.map((message, index) => (
              <ChatMessageRow
                key={`${message.role}-${index}`}
                message={message}
                index={index}
                onOpenSection={(sectionId) => {
                  closeChat();
                  onOpenSection(sectionId);
                }}
              />
            ))}
            {isSending && (
              <p className="portfolio-chat__thinking">Looking through the portfolio...</p>
            )}
          </div>

          <ChatComposer
            question={question}
            error={error}
            isSending={isSending}
            inputRef={questionInputRef}
            onQuestionChange={(value) => setQuestion(value.slice(0, MAX_QUESTION_LENGTH))}
            onSubmit={sendQuestion}
          />
        </section>
      )}

      <button
        className="portfolio-chat__toggle"
        type="button"
        onClick={() => {
          if (isOpen) closeChat();
          else setIsOpen(true);
        }}
        aria-expanded={isOpen}
        aria-controls="portfolio-chat-title"
      >
        <span aria-hidden="true">✦</span>
        {isOpen ? "Close" : "Ask AI"}
      </button>
    </div>
  );
}

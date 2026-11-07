import { useEffect, useRef, useState } from "react";

type Source = {
  title: string;
  source: string;
  similarity: number;
};

type Message = {
  role: "assistant" | "user";
  text: string;
  sources?: Source[];
};

const starterMessage: Message = {
  role: "assistant",
  text: "Hi! Ask me about Sreejita's projects, experience, education, or skills.",
};

export function PortfolioChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<Message[]>([starterMessage]);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState("");
  const messageListRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };

    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [isOpen]);

  useEffect(() => {
    messageListRef.current?.scrollTo({
      top: messageListRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, isSending]);

  const sendQuestion = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedQuestion = question.trim();
    if (!trimmedQuestion || isSending) return;

    setQuestion("");
    setError("");
    setIsSending(true);
    setMessages((current) => [
      ...current,
      { role: "user", text: trimmedQuestion },
    ]);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: trimmedQuestion }),
      });

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error || "The assistant could not answer just now.");
      }

      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          text: payload.answer,
          sources: payload.sources,
        },
      ]);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "The assistant could not answer just now.",
      );
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="portfolio-chat">
      {isOpen && (
        <section
          className="portfolio-chat__panel ui-panel"
          aria-labelledby="portfolio-chat-title"
        >
          <header className="portfolio-chat__header">
            <div>
              <p className="eyebrow">Portfolio guide</p>
              <h2 id="portfolio-chat-title">Ask AI</h2>
            </div>
            <button
              className="portfolio-chat__close"
              type="button"
              onClick={() => setIsOpen(false)}
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
              <article
                key={`${message.role}-${index}`}
                className={`portfolio-chat__message portfolio-chat__message--${message.role}`}
              >
                <p>{message.text}</p>
                {message.sources && message.sources.length > 0 && (
                  <div className="portfolio-chat__sources">
                    <span>Relevant portfolio sections</span>
                    <ul>
                      {message.sources.map((source) => (
                        <li key={`${source.source}-${source.title}`}>
                          {source.title}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </article>
            ))}
            {isSending && (
              <p className="portfolio-chat__thinking">Looking through the portfolio...</p>
            )}
          </div>

          <form className="portfolio-chat__form" onSubmit={sendQuestion}>
            <label className="sr-only" htmlFor="portfolio-question">
              Ask a question about Sreejita's portfolio
            </label>
            <textarea
              id="portfolio-question"
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
              placeholder="Ask about projects, experience, or skills..."
              rows={2}
              maxLength={500}
              disabled={isSending}
            />
            {error && <p className="portfolio-chat__error" role="alert">{error}</p>}
            <button
              className="portfolio-chat__send ui-button"
              type="submit"
              disabled={!question.trim() || isSending}
            >
              {isSending ? "Thinking..." : "Ask"}
            </button>
          </form>
        </section>
      )}

      <button
        className="portfolio-chat__toggle"
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-expanded={isOpen}
        aria-controls="portfolio-chat-title"
      >
        <span aria-hidden="true">✦</span>
        {isOpen ? "Close AI" : "Ask AI"}
      </button>
    </div>
  );
}

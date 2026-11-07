import { Fragment, type ReactNode, useCallback, useEffect, useRef, useState } from "react";

type Source = {
  title: string;
  source: string;
  similarity: number;
  metadata?: {
    section?: string;
  };
};

type Message = {
  role: "assistant" | "user";
  text: string;
  sources?: Source[];
};

const starterMessage: Message = {
  role: "assistant",
  text: "Hi! You can ask me about my projects, experience, education, or skills.",
};
const outOfTokensMessage = "Oops sorry, I am out of tokens, sorry about that :P";

const boldMarkdown = /(\*\*[^*]+\*\*)/g;

function renderMessageText(text: string): ReactNode {
  return text.split("\n").map((line, lineIndex, lines) => (
    <Fragment key={`${line}-${lineIndex}`}>
      {line.split(boldMarkdown).map((part, partIndex) =>
        part.startsWith("**") && part.endsWith("**") ? (
          <strong key={partIndex}>{part.slice(2, -2)}</strong>
        ) : (
          <Fragment key={partIndex}>{part}</Fragment>
        ),
      )}
      {lineIndex < lines.length - 1 && <br />}
    </Fragment>
  ));
}

function getPortfolioSectionId(source: Source) {
  if (source.source === "projects.md") return "projects";
  if (source.source === "education.md") return "education";

  switch (source.metadata?.section?.toLowerCase()) {
    case "profile":
      return "about";
    case "education":
      return "education";
    case "experience":
      return "experience";
    case "technical skills":
      return "skills";
    case "selected projects":
      return "projects";
    default:
      return undefined;
  }
}

type PortfolioChatProps = {
  onOpenSection: (sectionId: string) => void;
};

export function PortfolioChat({ onOpenSection }: PortfolioChatProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<Message[]>([starterMessage]);
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
    window.addEventListener("obby-open-ai-chat", openChat);
    return () => window.removeEventListener("obby-open-ai-chat", openChat);
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
    setMessages((current) => [
      ...current,
      { role: "user", text: trimmedQuestion },
    ]);

    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), 25_000);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: trimmedQuestion }),
        signal: controller.signal,
      });

      const responseBody = await response.text();
      let payload: { answer?: string; sources?: Source[]; error?: string };
      try {
        payload = JSON.parse(responseBody) as typeof payload;
      } catch {
        throw new Error("The chat service is temporarily unavailable.");
      }

      if (!response.ok) {
        throw new Error(payload.error || "The assistant could not answer just now.");
      }

      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          text: payload.answer || "I could not generate an answer just now.",
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

      if (message === outOfTokensMessage) {
        setMessages((current) => [
          ...current,
          { role: "assistant", text: outOfTokensMessage },
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
              <p className="eyebrow">Portfolio guide</p>
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
              <div
                key={`${message.role}-${index}`}
                className={`portfolio-chat__message-row portfolio-chat__message-row--${message.role}`}
              >
                {message.role === "assistant" && (
                  <img
                    className="portfolio-chat__message-avatar"
                    src="/images/myprofilepic-transparent.png"
                    alt="Sreejita"
                  />
                )}
                <article className={`portfolio-chat__message portfolio-chat__message--${message.role}`}>
                  <p>{renderMessageText(message.text)}</p>
                  {message.sources && message.sources.length > 0 && (
                    <div className="portfolio-chat__sources">
                      <span>Relevant portfolio sections</span>
                      <ul>
                        {message.sources.map((source) => {
                          const sectionId = getPortfolioSectionId(source);
                          return (
                            <li key={`${source.source}-${source.title}`}>
                              {sectionId ? (
                                <button
                                  type="button"
                                  onClick={() => {
                                    closeChat();
                                    onOpenSection(sectionId);
                                  }}
                                  aria-label={`Open the ${sectionId} portfolio section`}
                                >
                                  {source.title}
                                </button>
                              ) : (
                                source.title
                              )}
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  )}
                </article>
              </div>
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
              ref={questionInputRef}
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault();
                  event.currentTarget.form?.requestSubmit();
                }
              }}
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
        onClick={() => {
          if (isOpen) closeChat();
          else setIsOpen(true);
        }}
        aria-expanded={isOpen}
        aria-controls="portfolio-chat-title"
      >
        <span aria-hidden="true">✦</span>
        {isOpen ? "Close AI" : "Ask AI"}
      </button>
    </div>
  );
}

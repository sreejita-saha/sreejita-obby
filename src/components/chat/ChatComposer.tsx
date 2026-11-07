import type { FormEvent, KeyboardEvent, RefObject } from "react";

type ChatComposerProps = {
  question: string;
  error: string;
  isSending: boolean;
  inputRef: RefObject<HTMLTextAreaElement | null>;
  onQuestionChange: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

/** Input and submit controls. Enter submits; Shift+Enter adds a line break. */
export function ChatComposer({
  question,
  error,
  isSending,
  inputRef,
  onQuestionChange,
  onSubmit,
}: ChatComposerProps) {
  const submitOnEnter = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key !== "Enter" || event.shiftKey) return;
    event.preventDefault();
    event.currentTarget.form?.requestSubmit();
  };

  return (
    <form className="portfolio-chat__form" onSubmit={onSubmit}>
      <label className="sr-only" htmlFor="portfolio-question">
        Ask a question about Sreejita's portfolio
      </label>
      <textarea
        id="portfolio-question"
        ref={inputRef}
        value={question}
        onChange={(event) => onQuestionChange(event.target.value)}
        onKeyDown={submitOnEnter}
        placeholder="Ask about projects, experience, or skills..."
        rows={2}
        maxLength={500}
        disabled={isSending}
      />
      {error && (
        <p className="portfolio-chat__error" role="alert">
          {error}
        </p>
      )}
      <button
        className="portfolio-chat__send ui-button"
        type="submit"
        disabled={!question.trim() || isSending}
      >
        {isSending ? "Thinking..." : "Ask"}
      </button>
    </form>
  );
}

import { getPortfolioSectionId, renderChatMessage } from "./chat.utils";
import type { ChatMessage } from "./chat.types";

type ChatMessageRowProps = {
  message: ChatMessage;
  index: number;
  onOpenSection: (sectionId: string) => void;
};

/** One left-aligned Sreejita answer or right-aligned visitor message. */
export function ChatMessageRow({
  message,
  index,
  onOpenSection,
}: ChatMessageRowProps) {
  return (
    <div
      className={`portfolio-chat__message-row portfolio-chat__message-row--${message.role}`}
    >
      {message.role === "assistant" && (
        <img
          className="portfolio-chat__message-avatar"
          src="/images/myprofilepic-transparent.png"
          alt="Sreejita"
        />
      )}
      <article
        className={`portfolio-chat__message portfolio-chat__message--${message.role}`}
        aria-label={`${message.role} message ${index + 1}`}
      >
        <p>{renderChatMessage(message.text)}</p>
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
                        onClick={() => onOpenSection(sectionId)}
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
  );
}

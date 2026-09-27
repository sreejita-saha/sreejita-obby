import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { ControlIcon } from "./ControlIcon";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabasePublishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
const commentMaxLength = 300;

export function RatingWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const close = () => {
    setIsOpen(false);
    setRating(0);
    setComment("");
    setSubmitted(false);
    setError("");
  };

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    if (isOpen) window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen]);

  const submitRating = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!rating || isSubmitting) return;

    if (!supabaseUrl || !supabasePublishableKey) {
      setError("Ratings are not configured yet. Please try again later.");
      return;
    }

    setError("");
    setIsSubmitting(true);

    try {
      const response = await fetch(`${supabaseUrl}/rest/v1/ratings`, {
        method: "POST",
        headers: {
          apikey: supabasePublishableKey,
          Authorization: `Bearer ${supabasePublishableKey}`,
          "Content-Type": "application/json",
          Prefer: "return=minimal",
        },
        body: JSON.stringify({ rating, comment: comment.trim() }),
      });

      if (!response.ok) throw new Error("Rating request failed");
      setSubmitted(true);
    } catch {
      setError("That did not send. Please check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <button type="button" className="rating-toggle" onClick={() => setIsOpen(true)} aria-label="Rate this portfolio">
        <ControlIcon name="rate" />
        <span>Rate</span>
      </button>
      {isOpen && createPortal(
        <div className="rating-backdrop" role="presentation" onMouseDown={close}>
          <section className="rating-modal" role="dialog" aria-modal="true" aria-labelledby="rating-title" onMouseDown={(event) => event.stopPropagation()}>
            <button className="close" type="button" onClick={close} aria-label="Close rating form">×</button>
            {submitted ? (
              <div className="rating-thanks">
                <span aria-hidden="true">★</span>
                <h2 id="rating-title">Thank you!</h2>
                <p>Your feedback means a lot to me :)</p>
                <button type="button" className="rating-submit" onClick={close}>Close</button>
              </div>
            ) : (
              <form onSubmit={submitRating}>
                <p className="eyebrow">Quick feedback</p>
                <h2 id="rating-title">How was the obby?</h2>
                <div className="rating-stars" aria-label="Choose a rating from one to five stars">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <button key={value} type="button" className={value <= rating ? "selected" : ""} onClick={() => setRating(value)} aria-label={`${value} star${value === 1 ? "" : "s"}`} aria-pressed={value === rating}>★</button>
                  ))}
                </div>
                <label htmlFor="rating-comment">Anything you want to share? <span>(optional)</span></label>
                <textarea id="rating-comment" value={comment} onChange={(event) => setComment(event.target.value)} placeholder="I liked..." rows={4} maxLength={commentMaxLength} />
                <p className="rating-character-count" aria-live="polite">{comment.length}/{commentMaxLength}</p>
                {error && <p role="alert" className="rating-error">{error}</p>}
                <button className="rating-submit" type="submit" disabled={!rating || isSubmitting}>{isSubmitting ? "Sending..." : "Submit rating"}</button>
              </form>
            )}
          </section>
        </div>,
        document.body,
      )}
    </>
  );
}

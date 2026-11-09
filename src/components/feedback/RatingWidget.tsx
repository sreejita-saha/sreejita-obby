import { useEffect, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { ControlIcon } from "../ui/ControlIcon";
import { submitRating as sendRating } from "../../services/ratings";
import "../../styles/feedback/RatingWidget.css";
import "../../styles/ui/GameControls.css";
import "../../styles/ui-primitives.css";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabasePublishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
const commentMaxLength = 300;
const minimumFormTimeMs = 2_500;

export function RatingWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [openedAt, setOpenedAt] = useState(0);
  const [website, setWebsite] = useState("");

  const close = () => {
    setIsOpen(false);
    setRating(0);
    setComment("");
    setSubmitted(false);
    setError("");
    setWebsite("");
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

    if (website || Date.now() - openedAt < minimumFormTimeMs) {
      setError("Please wait a moment before submitting your feedback.");
      return;
    }

    setError("");
    setIsSubmitting(true);

    try {
      const result = await sendRating(
        { url: supabaseUrl, publishableKey: supabasePublishableKey },
        rating,
        comment,
      );

      if (result === "rate-limited") {
        setError("Thanks — please wait a few minutes before rating again.");
        return;
      }
      setSubmitted(true);
    } catch {
      setError("That did not send. Please check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <button
        type="button"
        className="rating-toggle"
        onClick={() => {
          setOpenedAt(Date.now());
          setIsOpen(true);
        }}
        aria-label="Rate this portfolio"
        data-tooltip="Share feedback on the obby"
      >
        <ControlIcon name="rate" />
        <span>Rate</span>
      </button>
      <Dialog.Root open={isOpen} onOpenChange={(open) => !open && close()}>
        <Dialog.Portal>
          <Dialog.Overlay className="rating-backdrop" />
          <Dialog.Content
            className="rating-modal ui-panel"
            aria-label="Rate this portfolio"
            aria-describedby={undefined}
          >
            <Dialog.Close asChild>
              <button
                className="close"
                type="button"
                aria-label="Close rating form"
                data-tooltip="Close without sending feedback"
              >
                ×
              </button>
            </Dialog.Close>
            {submitted ? (
              <div className="rating-thanks">
                <span aria-hidden="true">★</span>
                <Dialog.Title asChild>
                  <h2 id="rating-title">Thank you!</h2>
                </Dialog.Title>
                <p>Your feedback means a lot to me :)</p>
                <button
                  type="button"
                  className="rating-submit ui-button"
                  onClick={close}
                  data-tooltip="Return to the obby"
                >
                  Close
                </button>
              </div>
            ) : (
              <form onSubmit={submitRating}>
                <p className="eyebrow">Quick feedback</p>
                <Dialog.Title asChild>
                  <h2 id="rating-title">How was the obby?</h2>
                </Dialog.Title>
                <div
                  className="rating-stars"
                  aria-label="Choose a rating from one to five stars"
                >
                  {[1, 2, 3, 4, 5].map((value) => (
                    <button
                      key={value}
                      type="button"
                      className={value <= rating ? "selected" : ""}
                      onClick={() => setRating(value)}
                      aria-label={`${value} star${value === 1 ? "" : "s"}`}
                      aria-pressed={value === rating}
                      data-tooltip={`Give ${value} star${value === 1 ? "" : "s"}`}
                    >
                      ★
                    </button>
                  ))}
                </div>
                <label htmlFor="rating-comment">
                  Anything you want to share? <span>(optional)</span>
                </label>
                <textarea
                  id="rating-comment"
                  value={comment}
                  onChange={(event) => setComment(event.target.value)}
                  placeholder="I liked..."
                  rows={4}
                  maxLength={commentMaxLength}
                />
                <label className="rating-honeypot" aria-hidden="true">
                  Website
                  <input
                    tabIndex={-1}
                    autoComplete="off"
                    value={website}
                    onChange={(event) => setWebsite(event.target.value)}
                  />
                </label>
                <p className="rating-character-count" aria-live="polite">
                  {comment.length}/{commentMaxLength}
                </p>
                {error && (
                  <p role="alert" className="rating-error">
                    {error}
                  </p>
                )}
                <button
                  className="rating-submit ui-button"
                  type="submit"
                  disabled={!rating || isSubmitting}
                  data-tooltip="Send your rating and comment"
                >
                  {isSubmitting ? "Sending..." : "Submit rating"}
                </button>
              </form>
            )}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
}

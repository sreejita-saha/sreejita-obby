
import { useProgress } from "@react-three/drei";
import { useEffect, useRef, useState } from "react";
import "../../styles/screens/LoadingScreen.css";

type LoadingScreenProps = {
  onReady: () => void;
};

export function LoadingScreen({ onReady }: LoadingScreenProps) {
  const { active, progress, total, loaded } = useProgress();

  const [displayProgress, setDisplayProgress] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [leaving, setLeaving] = useState(false);

  const startedAt = useRef(performance.now());
  const onReadyRef = useRef(onReady);
  const dismissedRef = useRef(false);

  useEffect(() => {
    onReadyRef.current = onReady;
  }, [onReady]);

  // Smoothly update the displayed loading percentage.
  useEffect(() => {
    if (completed) return;

    const target = Math.min(
      99,
      Math.max(0, Math.round(progress)),
    );

    setDisplayProgress((current) => Math.max(current, target));
  }, [progress, completed]);

  // Only finish once the assets have loaded.
  useEffect(() => {
    if (active || progress < 100 || completed) return;

    // Avoid flashing the loading screen on fast connections.
    const elapsed = performance.now() - startedAt.current;
    const remaining = Math.max(0, 1000 - elapsed);

    const timer = window.setTimeout(() => {
      setDisplayProgress(100);
      setCompleted(true);
    }, remaining);

    return () => window.clearTimeout(timer);
  }, [active, progress, completed]);

  // Play the exit animation, then enter the portfolio.
  useEffect(() => {
    if (!completed) return;

    const leaveTimer = window.setTimeout(() => {
      setLeaving(true);
    }, 550);

    const dismissTimer = window.setTimeout(() => {
      if (dismissedRef.current) return;
      dismissedRef.current = true;
      onReadyRef.current();
    }, 1250);

    return () => {
      window.clearTimeout(leaveTimer);
      window.clearTimeout(dismissTimer);
    };
  }, [completed]);

  const percentage = completed ? 100 : displayProgress;

  return (
    <section
      className={`obby-loader ${
        completed ? "obby-loader--complete" : ""
      } ${leaving ? "obby-loader--leaving" : ""}`}
      role="status"
      aria-label="Loading Sreejita's portfolio"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={percentage}
    >
      {/* Background */}
      <div className="obby-loader__sky" aria-hidden="true" />

      {/* Clouds */}
      <div className="obby-cloud obby-cloud--one" aria-hidden="true" />
      <div className="obby-cloud obby-cloud--two" aria-hidden="true" />
      <div className="obby-cloud obby-cloud--three" aria-hidden="true" />
      <div className="obby-cloud obby-cloud--four" aria-hidden="true" />
      <div className="obby-cloud obby-cloud--five" aria-hidden="true" />
      <div className="obby-cloud obby-cloud--six" aria-hidden="true" />

      {/* Sun */}
      <div className="obby-sun" aria-hidden="true">
        <span className="obby-sun__face">ᴗ</span>
      </div>

      {/* Top checkpoint indicators */}
      <div className="obby-loader__checkpoints" aria-hidden="true">
        {Array.from({ length: 7 }, (_, index) => (
          <span
            key={index}
            className={
              percentage >= ((index + 1) / 7) * 100
                ? "is-filled"
                : ""
            }
          />
        ))}
      </div>

      {/* Title */}
      <header className="obby-loader__header">
        <div className="obby-loader__title">
          <span className="obby-loader__sparkle">✦</span>
          <h1>Sreejita's World</h1>
          <span className="obby-loader__sparkle">✦</span>
        </div>

        <div className="obby-loader__subtitle">
          {completed ? "Ready!" : "Loading..."}
        </div>
      </header>

      {/* Decorative floating platforms */}
      <div className="obby-scenery" aria-hidden="true">
        <div className="obby-platform obby-platform--left-bottom" />
        <div className="obby-platform obby-platform--left-top" />

        <div className="obby-platform obby-platform--right-bottom" />
        <div className="obby-platform obby-platform--right-middle" />

        <div className="obby-platform obby-platform--checkpoint">
          <div className="obby-flag">
            <span />
          </div>
        </div>
      </div>

      {/* Floating Roblox avatar */}
      <div className="obby-loader__character" aria-hidden="true">
        <div className="obby-loader__avatar">
          <img
            src="/images/loading-avatar.png"
            alt=""
            draggable={false}
          />

          <div className="obby-loader__avatar-sparkles">
            <span />
            <span />
            <span />
          </div>
        </div>

        <div className="obby-loader__shadow" />
      </div>

      {/* Loading progress */}
      <div className="obby-loader__footer">
        <div
          className="obby-loader__progress"
          role="progressbar"
          aria-label="World loading progress"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={percentage}
        >
          <div
            className="obby-loader__progress-fill"
            style={{ width: `${percentage}%` }}
          />

          <span className="obby-loader__percentage">
            {percentage}%
          </span>
        </div>

        <p className="obby-loader__status">
          <span className="obby-loader__cube" aria-hidden="true">
            ◈
          </span>

          {completed
            ? "YOUR WORLD IS READY!"
            : "BUILDING YOUR PORTFOLIO WORLD..."}
        </p>
      </div>
    </section>
  );
}

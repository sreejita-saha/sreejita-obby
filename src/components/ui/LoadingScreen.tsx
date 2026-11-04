import { useProgress } from "@react-three/drei";
import { useEffect, useState } from "react";

type LoadingScreenProps = {
  onReady: () => void;
};

export function LoadingScreen({ onReady }: LoadingScreenProps) {
  const { active, progress } = useProgress();
  const [elapsed, setElapsed] = useState(0);
  const [lifting, setLifting] = useState(false);
  const [hasObservedLoading, setHasObservedLoading] = useState(false);
  const [displayProgress, setDisplayProgress] = useState(0);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    const startedAt = performance.now();
    const timer = window.setInterval(
      () => setElapsed(performance.now() - startedAt),
      80,
    );
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (active || progress < 100) setHasObservedLoading(true);
  }, [active, progress]);

  useEffect(() => {
    if (!hasObservedLoading || completed) return;
    setDisplayProgress((current) =>
      Math.max(current, Math.min(99, Math.round(progress))),
    );
  }, [completed, hasObservedLoading, progress]);

  // useProgress initially reports 100% before the scene starts requesting its
  // assets. Wait until at least one real loading cycle has been observed.
  const ready =
    hasObservedLoading && !active && progress >= 100 && elapsed > 900;

  useEffect(() => {
    if (ready) setCompleted(true);
  }, [ready]);

  const progressLabel = completed ? 100 : displayProgress;

  useEffect(() => {
    if (!ready) return;
    const liftTimer = window.setTimeout(() => setLifting(true), 220);
    const dismissTimer = window.setTimeout(onReady, 950);
    return () => {
      window.clearTimeout(liftTimer);
      window.clearTimeout(dismissTimer);
    };
  }, [ready]);

  return (
    <section
      className={`loading-screen ${lifting ? "loading-screen--lifting" : ""}`}
      aria-live="polite"
      aria-label="Loading portfolio world"
    >
      <div className="loading-card">
        <img src="/images/mascot-logo.png" alt="Sreejita's Obby" />
        <span>Getting your obby ready · {progressLabel}%</span>
        <div
          className="loading-meter"
          role="progressbar"
          aria-label="Loading portfolio world"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={progressLabel}
        >
          {Array.from({ length: 6 }, (_, index) => (
            <span
              key={index}
              className={`loading-meter__segment ${progressLabel >= ((index + 1) / 6) * 100 ? "is-filled" : ""}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

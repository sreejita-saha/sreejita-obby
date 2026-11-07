import { useProgress } from "@react-three/drei";
import { useEffect, useState } from "react";
import "../../styles/screens/LoadingScreen.css";

type LoadingScreenProps = { onReady: () => void };

const loadingLines = [
  "Spawning into the obby…",
  "Stacking suspiciously bouncy platforms…",
  "Planting checkpoint flags…",
  "Teaching the noob how to wave…",
  "Your portfolio is ready.",
];

export function LoadingScreen({ onReady }: LoadingScreenProps) {
  const { active, progress } = useProgress();
  const [elapsed, setElapsed] = useState(0);
  const [lifting, setLifting] = useState(false);
  const [hasObservedLoading, setHasObservedLoading] = useState(false);
  const [displayProgress, setDisplayProgress] = useState(0);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    const startedAt = performance.now();
    const timer = window.setInterval(() => setElapsed(performance.now() - startedAt), 80);
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

  const ready = hasObservedLoading && !active && progress >= 100 && elapsed > 900;
  useEffect(() => {
    if (ready) setCompleted(true);
  }, [ready]);
  const progressLabel = completed ? 100 : displayProgress;
  const lineIndex = completed
    ? loadingLines.length - 1
    : Math.min(
        loadingLines.length - 2,
        Math.floor((Math.max(progressLabel, elapsed / 70) / 100) * 4),
      );

  useEffect(() => {
    if (!ready) return;
    const liftTimer = window.setTimeout(() => setLifting(true), 720);
    const dismissTimer = window.setTimeout(onReady, 1420);
    return () => {
      window.clearTimeout(liftTimer);
      window.clearTimeout(dismissTimer);
    };
  }, [ready, onReady]);

  return (
    <section
      className={`loading-screen ${completed ? "loading-screen--ready" : ""} ${lifting ? "loading-screen--lifting" : ""}`}
      aria-live="polite"
      aria-label="Entering Sreejita's portfolio world"
    >
      <div className="loading-sun" aria-hidden="true" />
      <div className="loading-cloud loading-cloud--one" aria-hidden="true" />
      <div className="loading-cloud loading-cloud--two" aria-hidden="true" />
      <div className="loading-hills" aria-hidden="true" />
      <main className="loading-world">
        <div className="loading-world__header">
          <div>
            <p className="loading-kicker">Sreejita's Obby</p>
            <h1>{completed ? "Ready, set, go!" : "Loading the fun bits"}</h1>
          </div>
          <div className="loading-avatar" aria-hidden="true">
            <img src="/images/mascot-logo.png" alt="" />
          </div>
        </div>
        <div className="loading-progress" aria-hidden="true">
          <span style={{ width: `${progressLabel}%` }} />
        </div>
        <div className="loading-copy">
          <p className="loading-status" key={lineIndex}>
            {completed
              ? "Everything is ready — see you inside!"
              : loadingLines[lineIndex]}
          </p>
          <p className="loading-percent">
            <span>World build</span> {progressLabel}%
          </p>
        </div>
      </main>
    </section>
  );
}

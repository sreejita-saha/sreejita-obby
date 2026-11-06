import { useProgress } from "@react-three/drei";
import { useEffect, useState, type CSSProperties } from "react";

type LoadingScreenProps = { onReady: () => void };

const loadingLines = [
  "Opening a portal to my world…",
  "Stacking suspiciously bouncy platforms…",
  "Planting checkpoint flags…",
  "Teaching the noob how to wave…",
  "Saving a spot for you at the start line…",
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
  useEffect(() => { if (active || progress < 100) setHasObservedLoading(true); }, [active, progress]);
  useEffect(() => {
    if (!hasObservedLoading || completed) return;
    setDisplayProgress((current) => Math.max(current, Math.min(99, Math.round(progress))));
  }, [completed, hasObservedLoading, progress]);

  const ready = hasObservedLoading && !active && progress >= 100 && elapsed > 900;
  useEffect(() => { if (ready) setCompleted(true); }, [ready]);
  const progressLabel = completed ? 100 : displayProgress;
  const lineIndex = completed ? loadingLines.length - 1 : Math.min(loadingLines.length - 2, Math.floor((Math.max(progressLabel, elapsed / 70) / 100) * 4));

  useEffect(() => {
    if (!ready) return;
    const liftTimer = window.setTimeout(() => setLifting(true), 720);
    const dismissTimer = window.setTimeout(onReady, 1420);
    return () => { window.clearTimeout(liftTimer); window.clearTimeout(dismissTimer); };
  }, [ready, onReady]);

  return (
    <section className={`loading-screen ${completed ? "loading-screen--ready" : ""} ${lifting ? "loading-screen--lifting" : ""}`} aria-live="polite" aria-label="Entering Sreejita's portfolio world">
      <div className="loading-stars" aria-hidden="true" />
      <div className="loading-cloud loading-cloud--one" aria-hidden="true" />
      <div className="loading-cloud loading-cloud--two" aria-hidden="true" />
      <div className="loading-portal" aria-hidden="true">
        <span className="loading-portal__ring loading-portal__ring--outer" />
        <span className="loading-portal__ring loading-portal__ring--inner" />
        <span className="loading-portal__glow" />
      </div>
      <div className="loading-world">
        <p className="loading-kicker">SREEJITA'S OBBY</p>
        <h1>{completed ? "Your run starts now." : "A world is waking up…"}</h1>
        <div className="loading-route" aria-hidden="true">
          {Array.from({ length: 6 }, (_, index) => (
            <span key={index} className={`loading-block loading-block--${index + 1} ${progressLabel >= ((index + 1) / 6) * 100 ? "is-built" : ""}`}>
              {index === 0 && <i>START</i>}{index === 5 && <i>FINISH</i>}
            </span>
          ))}
          <span className="loading-runner" style={{ "--runner-position": `${7 + Math.max(2, progressLabel) * 0.86}%` } as CSSProperties}>
            <img src="/images/mascot-logo.png" alt="" />
          </span>
        </div>
        <p className="loading-status" key={lineIndex}>{completed ? "Portal stable · see you on the other side" : loadingLines[lineIndex]}</p>
        <p className="loading-percent">WORLD BUILD: {progressLabel}%</p>
      </div>
      <div className="loading-floor" aria-hidden="true" />
    </section>
  );
}

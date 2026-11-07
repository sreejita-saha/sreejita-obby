import { useProgress } from "@react-three/drei";
import { useEffect, useRef, useState } from "react";
import "../../styles/screens/LoadingScreen.css";

type LoadingScreenProps = {
  onReady: () => void;
};

export function LoadingScreen({ onReady }: LoadingScreenProps) {
  const { active, progress } = useProgress();

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

    const target = Math.min(99, Math.max(0, Math.round(progress)));

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
      role="region"
      aria-label="Loading Sreejita's portfolio"
    >
      <div className="obby-loader__content">
        <div
          className="obby-loader__percentage"
          role="progressbar"
          aria-label="World loading progress"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={percentage}
        >
          {percentage}%
        </div>
        <div className="obby-loader__bar" aria-hidden="true">
          <div className="obby-loader__bar-fill" style={{ width: `${percentage}%` }} />
        </div>
      </div>
    </section>
  );
}

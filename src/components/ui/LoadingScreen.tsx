import { useProgress } from "@react-three/drei";
import { useEffect, useState } from "react";

type LoadingScreenProps = {
  onReady: () => void;
};

export function LoadingScreen({ onReady }: LoadingScreenProps) {
  const { active, progress } = useProgress();
  const [elapsed, setElapsed] = useState(0);
  const [lifting, setLifting] = useState(false);

  useEffect(() => {
    const startedAt = performance.now();
    const timer = window.setInterval(() => setElapsed(performance.now() - startedAt), 80);
    return () => window.clearInterval(timer);
  }, []);

  const ready = !active && progress >= 100 && elapsed > 900;

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
    <section className={`loading-screen ${lifting ? "loading-screen--lifting" : ""}`} aria-live="polite" aria-label="Loading portfolio world">
      <img src="/images/logo.png" alt="Sreejita's Obby" />
      <span>Loading</span>
    </section>
  );
}

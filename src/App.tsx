// App coordinates the game canvas and all HTML overlays. Edit this file when
// changing the overall game flow, menus, restart behaviour, or quality mode.
import { lazy, Suspense, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { creditsSection, portfolio } from "./data/portfolio";
import { ObbyScene } from "./components/scene/ObbyScene";
import { Hud } from "./components/ui/Hud";
import { WelcomeScreen } from "./components/ui/WelcomeScreen";
import { MusicToggle } from "./components/ui/MusicToggle";
import { RatingWidget } from "./components/ui/RatingWidget";
import { LoadingScreen } from "./components/ui/LoadingScreen";
import { TouchControls } from "./components/ui/TouchControls";
import { TooltipLayer } from "./components/ui/TooltipLayer";
// import "./styles/maintenance/MaintenancePage.css";
// import { BackgroundDecorations } from "./components/maintenance/BackgroundDecorations";
// import { MaintenanceCard } from "./components/maintenance/MaintenanceCard";
import "./styles/global.css";
import "./styles/components.css";
import "./styles/hud.css";
import "./styles/game-controls.css";
import "./styles/loading.css";
import "./styles/rating.css";
import "./styles/welcome.css";
import "./styles/overlays.css";
import "./styles/world-ui.css";

// These panels are requested only when opened, keeping the initial game load smaller.
const PortfolioMenu = lazy(() =>
  import("./components/ui/PortfolioMenu").then(({ PortfolioMenu }) => ({
    default: PortfolioMenu,
  })),
);
const SectionCard = lazy(() =>
  import("./components/ui/SectionCard").then(({ SectionCard }) => ({
    default: SectionCard,
  })),
);

function useLowPowerMode() {
  // Keep this query aligned with the devices on which you want simpler graphics.
  const query =
    "(max-width: 700px), (pointer: coarse), (prefers-reduced-motion: reduce)";
  const [lowPower, setLowPower] = useState(
    () => window.matchMedia(query).matches,
  );

  useEffect(() => {
    const media = window.matchMedia(query);
    const update = () => setLowPower(media.matches);
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  return lowPower;
}

function LegacyApp() {
  // `checkpoint` is -1 at the start, then matches the portfolio/checkpoint index.
  const [started, setStarted] = useState(false);
  const [checkpoint, setCheckpoint] = useState(-1);
  const [openSection, setOpenSection] = useState<number | null>(null);
  const [creditsOpen, setCreditsOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [resetKey, setResetKey] = useState(0);
  const [musicEnabled, setMusicEnabled] = useState(true);
  const [popupsEnabled, setPopupsEnabled] = useState(true);
  const [loaderDismissed, setLoaderDismissed] = useState(false);
  const lowPower = useLowPowerMode();

  useEffect(() => {
    // Browser back/forward navigation can restore this app from the bfcache,
    // including its React state. The portfolio overview is a transient overlay,
    // so never bring it back when the visitor returns to the page.
    const closePortfolioMenu = () => setMenuOpen(false);
    const closeWhenHidden = () => {
      if (document.visibilityState === "hidden") closePortfolioMenu();
    };
    const closeAfterRestore = (event: PageTransitionEvent) => {
      if (event.persisted) closePortfolioMenu();
    };

    document.addEventListener("visibilitychange", closeWhenHidden);
    window.addEventListener("pagehide", closePortfolioMenu);
    window.addEventListener("pageshow", closeAfterRestore);
    return () => {
      document.removeEventListener("visibilitychange", closeWhenHidden);
      window.removeEventListener("pagehide", closePortfolioMenu);
      window.removeEventListener("pageshow", closeAfterRestore);
    };
  }, []);

  const isPlaying =
    started && openSection === null && !creditsOpen && !menuOpen;

  const restartObby = () => {
    setCheckpoint(-1);
    setOpenSection(null);
    setCreditsOpen(false);
    setMenuOpen(false);
    setStarted(true);
    setResetKey((current) => current + 1);
  };

  const goBack = () => {
    setCheckpoint((current) => Math.max(-1, current - 1));
    setOpenSection(null);
    setCreditsOpen(false);
    setMenuOpen(false);
    setResetKey((current) => current + 1);
  };

  const closeSection = () => {
    setOpenSection(null);
  };

  const continueSection = () => {
    if (openSection === portfolio.length - 1) {
      restartObby();
      return;
    }
    closeSection();
  };

  const goToCheckpoint = (index: number) => {
    setStarted(true);
    setCheckpoint(index);
    setOpenSection(null);
    setMenuOpen(false);
    setResetKey((current) => current + 1);
  };

  const skipCheckpoint = () => {
    const nextCheckpoint = Math.min(checkpoint + 1, portfolio.length - 1);
    setStarted(true);
    setCheckpoint(nextCheckpoint);
    setOpenSection(null);
    setMenuOpen(false);
    setResetKey((current) => current + 1);
  };

  return (
    <main className="app-shell">
      <Canvas
        shadows={!lowPower}
        camera={{ position: [0, 4.8, 10], fov: 48 }}
        // A slightly lower internal resolution keeps touch devices responsive
        // while retaining a crisp-enough world at normal phone viewing size.
        dpr={lowPower ? [0.75, 1] : [1, 1.25]}
        gl={{
          antialias: !lowPower,
          alpha: true,
          powerPreference: "high-performance",
        }}
      >
        <Suspense fallback={null}>
          <ObbyScene
            playing={isPlaying}
            showIntro={!started}
            checkpoint={checkpoint}
            resetKey={resetKey}
            onRestart={restartObby}
            onBack={goBack}
            onCheckpoint={(index) => {
              setCheckpoint(index);
              if (popupsEnabled) setOpenSection(index);
            }}
            onOpenCheckpoint={(index) => {
              setCheckpoint(index);
              setOpenSection(index);
            }}
            onOpenCredits={() => setCreditsOpen(true)}
          />
        </Suspense>
      </Canvas>

      <Hud
        checkpoint={checkpoint}
        onOpenPortfolio={() => setMenuOpen(true)}
        onSelectCheckpoint={goToCheckpoint}
        onSkip={skipCheckpoint}
        popupsEnabled={popupsEnabled}
        onTogglePopups={() => setPopupsEnabled((enabled) => !enabled)}
      />
      <MusicToggle
        canPlay={started}
        enabled={musicEnabled}
        onToggle={() => setMusicEnabled((enabled) => !enabled)}
      />
      <RatingWidget />
      <TooltipLayer />

      {!loaderDismissed && (
        <LoadingScreen onReady={() => setLoaderDismissed(true)} />
      )}

      {!started && <WelcomeScreen onStart={() => setStarted(true)} />}
      {started && openSection === null && !creditsOpen && !menuOpen && (
        <>
          <div className="controls">
            <b>WASD</b> move <b>SPACE</b> jump <b>B</b> back <b>R</b> restart
          </div>
          <TouchControls />
        </>
      )}
      <Suspense fallback={null}>
        {openSection !== null && (
          <SectionCard
            section={portfolio[openSection]}
            onClose={closeSection}
            onContinue={continueSection}
          />
        )}
        {creditsOpen && (
          <SectionCard
            section={creditsSection}
            onClose={() => setCreditsOpen(false)}
            onContinue={() => setCreditsOpen(false)}
          />
        )}
        {menuOpen && <PortfolioMenu onClose={() => setMenuOpen(false)} />}
      </Suspense>
    </main>
  );
}

function App() {
  return <LegacyApp />;
  // return (
  //   <main className="maintenance-page">
  //     <BackgroundDecorations />
  //     <MaintenanceCard />
  //   </main>
  // );
}

export default App;
export { LegacyApp };

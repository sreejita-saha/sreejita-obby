import { Suspense, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { portfolio } from "./data/portfolio";
import { ObbyScene } from "./components/scene/ObbyScene";
import { Hud } from "./components/ui/Hud";
import { PortfolioMenu } from "./components/ui/PortfolioMenu";
import { SectionCard } from "./components/ui/SectionCard";
import { WelcomeScreen } from "./components/ui/WelcomeScreen";
import "./App.css";

function App() {
  const [started, setStarted] = useState(false);
  const [checkpoint, setCheckpoint] = useState(-1);
  const [openSection, setOpenSection] = useState<number | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [resetKey, setResetKey] = useState(0);

  const isPlaying = started && openSection === null && !menuOpen;

  const openPortfolioSection = (index: number) => {
    setMenuOpen(false);
    setOpenSection(index);
  };

  const restartObby = () => {
    setCheckpoint(-1);
    setOpenSection(null);
    setMenuOpen(false);
    setStarted(true);
    setResetKey((current) => current + 1);
  };

  const goBack = () => {
    setCheckpoint((current) => Math.max(-1, current - 1));
    setOpenSection(null);
    setMenuOpen(false);
    setResetKey((current) => current + 1);
  };

  const closeSection = () => {
    if (openSection === portfolio.length - 1) {
      restartObby();
      return;
    }
    setOpenSection(null);
  };

  return (
    <main className="app-shell">
      <Canvas shadows camera={{ position: [0, 4.8, 10], fov: 48 }} dpr={[1, 1.5]}>
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
              setOpenSection(index);
            }}
          />
        </Suspense>
      </Canvas>

      <Hud checkpoint={checkpoint} onOpenPortfolio={() => setMenuOpen(true)} />

      {!started && <WelcomeScreen onStart={() => setStarted(true)} />}
      {started && openSection === null && !menuOpen && (
        <div className="controls"><b>WASD</b> move <b>SPACE</b> jump <b>B</b> back <b>R</b> restart</div>
      )}
      {openSection !== null && <SectionCard section={portfolio[openSection]} onClose={closeSection} />}
      {menuOpen && <PortfolioMenu onClose={() => setMenuOpen(false)} onSelectSection={openPortfolioSection} />}
    </main>
  );
}

export default App;

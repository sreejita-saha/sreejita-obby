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

  const isPlaying = started && openSection === null && !menuOpen;

  const openPortfolioSection = (index: number) => {
    setMenuOpen(false);
    setOpenSection(index);
  };

  const closeSection = () => {
    if (openSection === portfolio.length - 1) {
      setCheckpoint(-1);
      setStarted(false);
    }
    setOpenSection(null);
  };

  return (
    <main className="app-shell">
      <Canvas shadows camera={{ position: [0, 4.8, 10], fov: 48 }} dpr={[1, 1.5]}>
        <Suspense fallback={null}>
          <ObbyScene
            playing={isPlaying}
            checkpoint={checkpoint}
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
        <div className="controls"><b>WASD</b> move <b>SPACE</b> jump <b>R</b> respawn</div>
      )}
      {openSection !== null && <SectionCard section={portfolio[openSection]} onClose={closeSection} />}
      {menuOpen && <PortfolioMenu onClose={() => setMenuOpen(false)} onSelectSection={openPortfolioSection} />}
    </main>
  );
}

export default App;

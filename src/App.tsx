import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Html, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import "./App.css";

type PortfolioSection = {
  id: string;
  kicker: string;
  title: string;
  body: string;
  links?: { label: string; href: string }[];
  color: string;
};

// Edit this block with your real information. The obby builds itself from it.
const portfolio: PortfolioSection[] = [
  {
    id: "about",
    kicker: "Checkpoint 01",
    title: "Hi, I’m Sreejita!",
    body: "I’m a curious builder who loves turning playful ideas into useful digital experiences. Welcome to my tiny corner of the internet.",
    color: "#ffd84d",
  },
  {
    id: "education",
    kicker: "Checkpoint 02",
    title: "Education",
    body: "Add your course, university, graduation year, and one sentence about what you focused on here.",
    color: "#ff7aa8",
  },
  {
    id: "projects",
    kicker: "Checkpoint 03",
    title: "Things I’ve built",
    body: "Feature two or three projects here. Explain the problem, what you made, and the part you’re most proud of.",
    links: [{ label: "View my GitHub", href: "https://github.com/" }],
    color: "#55d6be",
  },
  {
    id: "skills",
    kicker: "Checkpoint 04",
    title: "My toolkit",
    body: "React · TypeScript · JavaScript · HTML · CSS · Three.js — replace this list with the tools you actually enjoy using.",
    color: "#6fa8ff",
  },
  {
    id: "contact",
    kicker: "Finish!",
    title: "Let’s make something",
    body: "Thanks for playing! Add your email, LinkedIn, CV, and anything else you want visitors to find.",
    links: [{ label: "Say hello", href: "mailto:hello@example.com" }],
    color: "#b991ff",
  },
];

type PlatformData = {
  position: [number, number, number];
  size: [number, number, number];
  color: string;
  section?: number;
};

const platforms: PlatformData[] = [
  { position: [0, -0.5, 2], size: [7, 1, 7], color: "#72d572" },
  { position: [0, 0.15, -4], size: [3.4, 0.6, 3.2], color: "#ffd84d" },
  { position: [2.2, 0.75, -8], size: [3.2, 0.6, 3], color: "#ff9c4a" },
  { position: [-0.4, 1.25, -12], size: [4.8, 0.7, 3.5], color: portfolio[0].color, section: 0 },
  { position: [-3, 1.75, -16], size: [3, 0.6, 3], color: "#ff9c4a" },
  { position: [0.2, 2.35, -20], size: [4.8, 0.7, 3.5], color: portfolio[1].color, section: 1 },
  { position: [3.1, 2.9, -24], size: [3, 0.6, 3], color: "#ffd84d" },
  { position: [0.3, 3.5, -28], size: [4.8, 0.7, 3.5], color: portfolio[2].color, section: 2 },
  { position: [-3, 4.05, -32], size: [3, 0.6, 3], color: "#ff9c4a" },
  { position: [0, 4.65, -36], size: [4.8, 0.7, 3.5], color: portfolio[3].color, section: 3 },
  { position: [3, 5.2, -40], size: [3, 0.6, 3], color: "#ffd84d" },
  { position: [0, 5.8, -44], size: [7, 0.8, 6], color: portfolio[4].color, section: 4 },
];

const spawn = new THREE.Vector3(0, 1.2, 2);

function Noob({ intro }: { intro: boolean }) {
  const { scene } = useGLTF("/models/noob.glb");
  const model = useMemo(() => scene.clone(), [scene]);
  const modelFit = useMemo(() => {
    const box = new THREE.Box3().setFromObject(model);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());
    return {
      scale: 1.8 / Math.max(size.y, 0.001),
      offset: new THREE.Vector3(-center.x, -box.min.y, -center.z),
    };
  }, [model]);
  const ref = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    ref.current.rotation.z = intro
      ? Math.sin(clock.elapsedTime * 7) * 0.12
      : Math.sin(clock.elapsedTime * 5) * 0.018;
    ref.current.position.y = Math.sin(clock.elapsedTime * 3) * 0.025 - 0.85;
  });

  return (
    <group ref={ref} position={[0, -0.9, 0]} scale={modelFit.scale}>
      <primitive object={model} position={modelFit.offset} />
    </group>
  );
}

function Platform({ data }: { data: PlatformData }) {
  const section = data.section === undefined ? undefined : portfolio[data.section];
  return (
    <group>
      <mesh position={data.position} receiveShadow castShadow>
        <boxGeometry args={data.size} />
        <meshStandardMaterial color={data.color} roughness={0.72} />
      </mesh>
      {section && (
        <Html
          position={[
            data.position[0] + (data.section! % 2 === 0 ? -data.size[0] / 2 - 1.5 : data.size[0] / 2 + 1.5),
            data.position[1] + data.size[1] / 2 + 0.75,
            data.position[2],
          ]}
          center
          distanceFactor={8}
          transform
          occlude
        >
          <div className="world-label">
            <span>{section.kicker}</span>
            {section.title}
          </div>
        </Html>
      )}
    </group>
  );
}

function Decorations() {
  const clouds = [
    [-8, 8, -8],
    [7, 11, -20],
    [-9, 13, -33],
    [8, 15, -45],
  ] as [number, number, number][];
  return (
    <>
      {clouds.map((position, index) => (
        <group position={position} key={index}>
          {[-1, 0, 1].map((x) => (
            <mesh key={x} position={[x * 0.9, Math.abs(x) * -0.15, 0]}>
              <sphereGeometry args={[1.15, 16, 12]} />
              <meshStandardMaterial color="#ffffff" roughness={1} />
            </mesh>
          ))}
        </group>
      ))}
      <mesh position={[0, -7, -22]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[100, 100]} />
        <meshBasicMaterial color="#b8e8ff" />
      </mesh>
    </>
  );
}

type PlayerProps = {
  playing: boolean;
  onCheckpoint: (index: number) => void;
  checkpoint: number;
};

function Player({ playing, onCheckpoint, checkpoint }: PlayerProps) {
  const group = useRef<THREE.Group>(null);
  const velocity = useRef(new THREE.Vector3());
  const position = useRef(spawn.clone());
  const keys = useRef(new Set<string>());
  const grounded = useRef(false);
  const jumpHeld = useRef(false);
  const facing = useRef(Math.PI);
  const { camera } = useThree();

  const respawn = () => {
    const platform = checkpoint >= 0 ? platforms.find((item) => item.section === checkpoint) : undefined;
    position.current.set(
      platform?.position[0] ?? spawn.x,
      platform ? platform.position[1] + platform.size[1] / 2 + 1.1 : spawn.y,
      platform?.position[2] ?? spawn.z,
    );
    velocity.current.set(0, 0, 0);
  };

  useEffect(() => {
    const down = (event: KeyboardEvent) => {
      keys.current.add(event.code);
      if (["Space", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(event.code)) event.preventDefault();
      if (event.code === "KeyR") respawn();
    };
    const up = (event: KeyboardEvent) => keys.current.delete(event.code);
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  });

  useFrame((_, rawDelta) => {
    if (!group.current) return;
    const delta = Math.min(rawDelta, 0.035);
    const move = new THREE.Vector3();
    if (playing) {
      if (keys.current.has("KeyW") || keys.current.has("ArrowUp")) move.z -= 1;
      if (keys.current.has("KeyS") || keys.current.has("ArrowDown")) move.z += 1;
      if (keys.current.has("KeyA") || keys.current.has("ArrowLeft")) move.x -= 1;
      if (keys.current.has("KeyD") || keys.current.has("ArrowRight")) move.x += 1;
      if (move.lengthSq()) {
        move.normalize();
        velocity.current.x = THREE.MathUtils.lerp(velocity.current.x, move.x * 5.2, 0.2);
        velocity.current.z = THREE.MathUtils.lerp(velocity.current.z, move.z * 5.2, 0.2);
        facing.current = Math.atan2(move.x, move.z);
      } else {
        velocity.current.x *= 0.82;
        velocity.current.z *= 0.82;
      }
      const wantsJump = keys.current.has("Space");
      if (wantsJump && grounded.current && !jumpHeld.current) {
        velocity.current.y = 7.2;
        grounded.current = false;
      }
      jumpHeld.current = wantsJump;
    } else {
      velocity.current.x *= 0.8;
      velocity.current.z *= 0.8;
    }

    velocity.current.y -= 18 * delta;
    const previousY = position.current.y;
    position.current.addScaledVector(velocity.current, delta);
    grounded.current = false;

    for (const platform of platforms) {
      const [px, py, pz] = platform.position;
      const [sx, sy, sz] = platform.size;
      const top = py + sy / 2;
      const feet = position.current.y - 0.9;
      const previousFeet = previousY - 0.9;
      const inside = Math.abs(position.current.x - px) < sx / 2 + 0.28 && Math.abs(position.current.z - pz) < sz / 2 + 0.28;
      if (inside && velocity.current.y <= 0 && previousFeet >= top - 0.12 && feet <= top) {
        position.current.y = top + 0.9;
        velocity.current.y = 0;
        grounded.current = true;
        if (platform.section !== undefined && platform.section > checkpoint) onCheckpoint(platform.section);
      }
    }

    if (position.current.y < -8) respawn();
    group.current.position.copy(position.current);
    group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, facing.current, 0.18);

    const cameraTarget = position.current.clone().add(new THREE.Vector3(0, 3.8, 7.5));
    camera.position.lerp(cameraTarget, 1 - Math.pow(0.001, delta));
    camera.lookAt(position.current.x, position.current.y + 0.7, position.current.z - 2.2);
  });

  return (
    <group ref={group}>
      <Noob intro={!playing} />
      {!playing && (
        <Html position={[0, 2.25, 0]} center>
          <div className="speech">Hi, I’m Sreejita! 👋</div>
        </Html>
      )}
    </group>
  );
}

function Scene({ playing, checkpoint, onCheckpoint }: PlayerProps) {
  return (
    <>
      <color attach="background" args={["#87ceeb"]} />
      <fog attach="fog" args={["#87ceeb", 24, 72]} />
      <ambientLight intensity={1.8} />
      <directionalLight position={[8, 15, 7]} intensity={2.8} castShadow shadow-mapSize={[1024, 1024]} />
      <hemisphereLight args={["#dff5ff", "#6fae67", 1.2]} />
      <Decorations />
      {platforms.map((platform, index) => <Platform key={index} data={platform} />)}
      <Player playing={playing} checkpoint={checkpoint} onCheckpoint={onCheckpoint} />
    </>
  );
}

function SectionCard({ section, onClose }: { section: PortfolioSection; onClose: () => void }) {
  return (
    <div className="panel-backdrop">
      <article className="section-card" style={{ "--section-color": section.color } as React.CSSProperties}>
        <button className="close" onClick={onClose} aria-label="Continue playing">×</button>
        <p className="eyebrow">{section.kicker}</p>
        <h2>{section.title}</h2>
        <p>{section.body}</p>
        {section.links?.map((link) => (
          <a key={link.label} className="card-link" href={link.href} target="_blank" rel="noreferrer">{link.label} ↗</a>
        ))}
        <button className="continue" onClick={onClose}>{section.id === "contact" ? "Play again" : "Continue obby"}</button>
      </article>
    </div>
  );
}

function App() {
  const [started, setStarted] = useState(false);
  const [checkpoint, setCheckpoint] = useState(-1);
  const [openSection, setOpenSection] = useState<number | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const reachCheckpoint = (index: number) => {
    setCheckpoint(index);
    setOpenSection(index);
  };

  return (
    <main className="app-shell">
      <Canvas shadows camera={{ position: [0, 4.8, 10], fov: 48 }} dpr={[1, 1.5]}>
        <Suspense fallback={null}>
          <Scene playing={started && openSection === null && !menuOpen} checkpoint={checkpoint} onCheckpoint={reachCheckpoint} />
        </Suspense>
      </Canvas>

      <header className="hud">
        <a className="brand" href="#top">SREEJITA’S OBBY</a>
        <div className="progress" aria-label={`${checkpoint + 1} of ${portfolio.length} checkpoints`}>
          {portfolio.map((_, index) => <i key={index} className={index <= checkpoint ? "done" : ""} />)}
        </div>
        <button className="menu-button" onClick={() => setMenuOpen(true)}>Portfolio</button>
      </header>

      {!started && (
        <section className="welcome">
          <p className="eyebrow">A tiny playable portfolio</p>
          <h1>Hi, I’m Sreejita!</h1>
          <p>Jump through my world and unlock a little more about me at every checkpoint.</p>
          <button onClick={() => setStarted(true)}>Start the obby <span>→</span></button>
          <small>WASD / arrow keys to move · Space to jump</small>
        </section>
      )}

      {started && openSection === null && !menuOpen && (
        <div className="controls"><b>WASD</b> move <b>SPACE</b> jump <b>R</b> respawn</div>
      )}

      {openSection !== null && (
        <SectionCard
          section={portfolio[openSection]}
          onClose={() => {
            if (openSection === portfolio.length - 1) {
              setCheckpoint(-1);
              setStarted(false);
            }
            setOpenSection(null);
          }}
        />
      )}

      {menuOpen && (
        <div className="portfolio-menu">
          <button className="close" onClick={() => setMenuOpen(false)} aria-label="Close portfolio">×</button>
          <p className="eyebrow">No jumping required</p>
          <h2>Sreejita’s portfolio</h2>
          <div className="menu-grid">
            {portfolio.map((section, index) => (
              <button key={section.id} onClick={() => { setMenuOpen(false); setOpenSection(index); }}>
                <span style={{ background: section.color }}>{String(index + 1).padStart(2, "0")}</span>
                <strong>{section.title}</strong>
                <small>{section.body}</small>
              </button>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}

useGLTF.preload("/models/noob.glb");

export default App;

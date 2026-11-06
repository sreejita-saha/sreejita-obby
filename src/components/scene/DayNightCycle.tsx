// A lightweight, in-world sky cycle. One complete sunrise-to-sunrise loop is 60 seconds.
import { Stars } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { forwardRef, useRef } from "react";
import * as THREE from "three";

const CYCLE_SECONDS = 60;
const nightGradient = ["#091032", "#182250", "#3b426f"].map((color) => new THREE.Color(color));
const dawnGradient = ["#69416f", "#e27c7c", "#ffd28a"].map((color) => new THREE.Color(color));
const dayGradient = ["#4e9fda", "#82d0ed", "#d7f4ff"].map((color) => new THREE.Color(color));
const sunsetGradient = ["#55345f", "#cc6577", "#ffba52"].map((color) => new THREE.Color(color));

export function DayNightCycle() {
  const sun = useRef<THREE.Group>(null);
  const moon = useRef<THREE.Group>(null);
  const stars = useRef<THREE.Group>(null);
  const gradientColors = useRef([new THREE.Color(), new THREE.Color(), new THREE.Color()]);
  const appShell = useRef<HTMLElement | null>(null);

  useFrame(({ camera, clock, scene }) => {
    // Starts at a bright midday, then reaches night halfway through the minute.
    const phase = Math.PI / 2 + (clock.getElapsedTime() / CYCLE_SECONDS) * Math.PI * 2;
    const sunHeight = Math.sin(phase);
    // One very distant, world-space orbit keeps the bodies independent of the
    // player while remaining ahead of every checkpoint on this forward route.
    const placeOnArc = (target: THREE.Group | null, angle: number) => {
      if (!target) return;
      const height = Math.sin(angle);
      // Only the upper half of the path is ever visible: horizon -> apex ->
      // horizon. The hidden return journey happens behind the horizon.
      const skyY = 10 + 55 * Math.max(height, 0);
      target.position.set(-185 * Math.cos(angle), skyY, -270);
    };
    placeOnArc(sun.current, phase);
    placeOnArc(moon.current, phase - Math.PI);
    // Fade each character down at the horizon so it disappears rather than
    // visibly travelling through the bottom half of a circular orbit.
    const setArcVisibility = (target: THREE.Group | null, height: number, baseScale: number) => {
      if (!target) return;
      const fade = THREE.MathUtils.smoothstep(height, 0.03, 0.16);
      target.visible = fade > 0.01;
      target.scale.setScalar(baseScale * fade);
    };
    setArcVisibility(sun.current, sunHeight, 10.5);
    setArcVisibility(moon.current, -sunHeight, 7.2);
    if (stars.current) stars.current.visible = sunHeight < 0;
    // Stars are an infinitely distant backdrop, so they have no player-motion
    // parallax as the course camera travels forward.
    stars.current?.position.copy(camera.position);
    if (sun.current) sun.current.rotation.z = 0;
    if (moon.current) moon.current.rotation.z = 0;

    // Blend three sky stops through separate dawn/day/sunset palettes.
    const horizonGradient = Math.cos(phase) >= 0 ? dawnGradient : sunsetGradient;
    const twilightBlend = THREE.MathUtils.smoothstep(sunHeight, -0.7, 0.14);
    const dayBlend = THREE.MathUtils.smoothstep(sunHeight, 0.03, 0.72);
    gradientColors.current.forEach((color, index) => {
      color.lerpColors(nightGradient[index], horizonGradient[index], twilightBlend);
      color.lerp(dayGradient[index], dayBlend);
    });
    scene.background = null;
    appShell.current ??= document.querySelector<HTMLElement>(".app-shell");
    if (appShell.current) {
      appShell.current.style.setProperty("--sky-top", `#${gradientColors.current[0].getHexString()}`);
      appShell.current.style.setProperty("--sky-mid", `#${gradientColors.current[1].getHexString()}`);
      appShell.current.style.setProperty("--sky-bottom", `#${gradientColors.current[2].getHexString()}`);
    }
  });

  return (
    <>
      <group ref={stars}>
        <Stars radius={90} depth={35} count={1300} factor={4.2} saturation={0.35} fade speed={0.15} />
      </group>
      <CelestialCharacter ref={sun} kind="sun" />
      <CelestialCharacter ref={moon} kind="moon" />
    </>
  );
}

type CelestialKind = "sun" | "moon";

const CelestialCharacter = forwardRef<THREE.Group, { kind: CelestialKind }>(function CelestialCharacter({ kind }, ref) {
  const isSun = kind === "sun";
  const faceColor = isSun ? "#ffbf27" : "#d9e5ff";
  const cheekColor = isSun ? "#f58d32" : "#9fb4e7";

  return (
    <group ref={ref} scale={isSun ? 10.5 : 7.2}>
      {isSun && Array.from({ length: 12 }, (_, index) => {
        const angle = (index / 12) * Math.PI * 2;
        return (
          <mesh key={index} position={[Math.cos(angle) * 1.3, Math.sin(angle) * 1.3, 0]} rotation={[0, 0, angle]}>
            <boxGeometry args={[0.42, 0.78, 0.28]} />
            <meshBasicMaterial color="#ff9e1c" fog={false} />
          </mesh>
        );
      })}
      <mesh castShadow>
        <sphereGeometry args={[1.22, 16, 12]} />
        <meshBasicMaterial color={faceColor} fog={false} />
      </mesh>
      <group position={[0, 0, 1.05]}>
        <mesh position={[-0.42, 0.2, 0]} scale={[0.2, 0.3, 0.12]}>
          <sphereGeometry args={[1, 16, 12]} /><meshBasicMaterial color="#17223b" fog={false} />
        </mesh>
        <mesh position={[0.42, 0.2, 0]} scale={[0.2, 0.3, 0.12]}>
          <sphereGeometry args={[1, 16, 12]} /><meshBasicMaterial color="#17223b" fog={false} />
        </mesh>
        <mesh position={[-0.48, 0.32, 0.1]} scale={[0.055, 0.08, 0.04]}>
          <sphereGeometry args={[1, 12, 8]} /><meshBasicMaterial color="#ffffff" fog={false} />
        </mesh>
        <mesh position={[0.36, 0.32, 0.1]} scale={[0.055, 0.08, 0.04]}>
          <sphereGeometry args={[1, 12, 8]} /><meshBasicMaterial color="#ffffff" fog={false} />
        </mesh>
        <mesh position={[0, -0.22, 0]} rotation={[0, 0, Math.PI]}>
          <torusGeometry args={[0.29, 0.06, 8, 16, Math.PI]} /><meshBasicMaterial color="#17223b" fog={false} />
        </mesh>
        <mesh position={[-0.73, -0.12, -0.02]} scale={[0.22, 0.13, 0.09]}>
          <sphereGeometry args={[1, 12, 8]} /><meshBasicMaterial color={cheekColor} fog={false} />
        </mesh>
        <mesh position={[0.73, -0.12, -0.02]} scale={[0.22, 0.13, 0.09]}>
          <sphereGeometry args={[1, 12, 8]} /><meshBasicMaterial color={cheekColor} fog={false} />
        </mesh>
      </group>
    </group>
  );
});

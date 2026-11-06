// Non-interactive background scenery. Cloud positions are configured in data/world.ts.
import { Sparkles } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import { cloudPositions } from "../../data/world";

const cloudPuffs = [
  [[-0.85, -0.05, 0, 0.72], [0, 0.25, 0, 1.05], [0.85, -0.05, 0, 0.72]],
  [[-0.82, 0, 0, 0.7], [0.03, 0.22, 0, 0.98], [0.84, 0.03, 0, 0.76]],
  [[-0.9, 0.02, 0, 0.76], [0, 0.3, 0, 1.08], [0.86, -0.03, 0, 0.7]],
  [[-0.84, -0.06, 0, 0.68], [0, 0.24, 0, 1.14], [0.9, 0.01, 0, 0.74]],
  [[-0.86, 0, 0, 0.73], [0, 0.28, 0, 1.02], [0.86, 0.05, 0, 0.76]],
] as const;

// Deliberate size variation prevents the sky from reading as repeated copies.
const cloudScales = [0.7, 1.7, 1.05, 2.05, 0.82, 1.35, 1.9, 0.95, 1.18, 0.68, 1.55, 0.9, 2.15, 1.12, 0.76, 1.48];

export function Decorations() {
  return (
    <>
      {cloudPositions.map((position, index) => (
        <DriftingCloud key={position.join("-")} position={position} index={index} />
      ))}
      <Sparkles
        count={65}
        position={[0, 4, -42]}
        scale={[26, 13, 88]}
        size={2.2}
        speed={0.2}
        opacity={0.55}
        color="#fff4aa"
      />
    </>
  );
}

function DriftingCloud({ position, index }: { position: (typeof cloudPositions)[number]; index: number }) {
  const cloud = useRef<THREE.Group>(null);
  const origin = useRef(new THREE.Vector3(...position));
  const scale = cloudScales[index % cloudScales.length];

  useFrame(({ clock }) => {
    if (!cloud.current) return;
    const time = clock.getElapsedTime();
    const speed = 0.06 + (index % 4) * 0.018;
    const distance = 1.4 + (index % 5) * 0.7;
    cloud.current.position.set(
      origin.current.x + Math.sin(time * speed + index * 1.7) * distance,
      origin.current.y + Math.sin(time * speed * 1.6 + index) * 0.25,
      origin.current.z + Math.cos(time * speed + index) * 0.55,
    );
  });

  return (
    <group ref={cloud}>
      {cloudPuffs[index % cloudPuffs.length].map(([x, y, z, size], puffIndex) => (
        <mesh key={puffIndex} position={[x * scale, y * scale, z * scale]} scale={[size * scale, size * 0.72 * scale, size * 0.82 * scale]}>
          <sphereGeometry args={[1, 16, 12]} />
          <meshStandardMaterial color="#ffffff" roughness={0.9} />
        </mesh>
      ))}
    </group>
  );
}

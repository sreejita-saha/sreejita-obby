import { useRef } from "react";
import { Image } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { Vector3Tuple } from "../../types/world";

type FinishBadgeProps = { position: Vector3Tuple };

const confetti = Array.from({ length: 28 }, (_, index) => ({
  direction: [Math.sin(index * 2.4) * (0.8 + (index % 3) * 0.18), 1.1 + (index % 5) * 0.16, Math.cos(index * 1.7) * (0.7 + (index % 4) * 0.16)] as Vector3Tuple,
  color: ["#ff5f85", "#ffd34e", "#5ad5f5", "#b991ff", "#75d86c"][index % 5],
}));

/** Small floating medal that marks the final checkpoint without blocking play. */
export function FinishBadge({ position }: FinishBadgeProps) {
  const badge = useRef<THREE.Group>(null);

  // A full turn takes roughly 4.5 seconds; the upright badge does not bob.
  useFrame((_, delta) => {
    if (badge.current) badge.current.rotation.y += delta * 1.4;
  });

  return (
    <group ref={badge} position={position}>
        {/* Thin gold coin edge behind the artwork gives the badge physical depth. */}
        <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.72, 0.72, 0.06, 50]} />
          <meshStandardMaterial color="#dea005" roughness={0.28} />
        </mesh>
        {/* Two copies make the user-provided badge readable from both sides. */}
        <Image url="/images/badge.png" position={[0, 0, 0.035]} scale={[1.55, 1.55]} transparent />
        <Image url="/images/badge.png" position={[0, 0, -0.035]} rotation={[0, Math.PI, 0]} scale={[1.55, 1.55]} transparent />
        {/* A permanent, quiet confetti halo instead of a triggered burst. */}
        <group>
          {confetti.map(({ direction: [x, y, z], color }, index) => (
            <mesh key={index} position={[x * 0.9, y * 0.1, z * 0.9]} rotation={[index, index * 0.7, index * 1.2]}>
              <boxGeometry args={[0.08, 0.13, 0.025]} />
              <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.22} />
            </mesh>
          ))}
        </group>
      </group>
  );
}

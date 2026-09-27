import { useRef } from "react";
import { Image } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { Vector3Tuple } from "../../types/world";

type FinishBadgeProps = { position: Vector3Tuple };

const confetti = Array.from({ length: 96 }, (_, index) => ({
  position: [
    Math.sin(index * 2.4) * (1.4 + (index % 7) * 0.42),
    0.35 + (index % 11) * 0.29,
    Math.cos(index * 1.7) * (1.1 + (index % 6) * 0.38),
  ] as Vector3Tuple,
  color: ["#ff5f85", "#ffd34e", "#5ad5f5", "#b991ff", "#75d86c"][index % 5],
}));

/** A badge surrounded by a wide, permanent confetti celebration at the finish. */
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
          <meshStandardMaterial color="#f474cd" roughness={0.28} />
        </mesh>
        {/* Two copies make the user-provided badge readable from both sides. */}
        <Image url="/images/badge.png" position={[0, 0, 0.035]} scale={[1.55, 1.55]} transparent />
        <Image url="/images/badge.png" position={[0, 0, -0.035]} rotation={[0, Math.PI, 0]} scale={[1.55, 1.55]} transparent />
        {/* A broad, permanent confetti field celebrates the entire final platform. */}
        <group>
          {confetti.map(({ position, color }, index) => (
            <mesh key={index} position={position} rotation={[index * 0.73, index * 1.1, index * 1.47]}>
              <boxGeometry args={[0.09, 0.16, 0.03]} />
              <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.28} />
            </mesh>
          ))}
        </group>
      </group>
  );
}

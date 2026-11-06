// Non-interactive background scenery. Cloud positions are configured in data/world.ts.
import { Instance, Instances, Sparkles } from "@react-three/drei";
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

export function Decorations() {
  const cloudBank = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!cloudBank.current) return;
    const time = clock.getElapsedTime();
    // A slow sideways breeze keeps the background feeling alive without
    // interfering with jumps or making the course feel like it is moving.
    cloudBank.current.position.x = Math.sin(time * 0.09) * 3.5;
    cloudBank.current.position.z = Math.cos(time * 0.06) * 1.2;
  });

  return (
    <>
      <group ref={cloudBank}>
      <Instances limit={cloudPositions.length * 3}>
        <sphereGeometry args={[1, 16, 12]} />
        <meshStandardMaterial color="#ffffff" roughness={0.9} />
        {cloudPositions.flatMap((position, index) => {
          const cloudScale = 1.25 + (index % 2) * 0.25;
          return cloudPuffs[index % cloudPuffs.length].map(([x, y, z, size], puffIndex) => (
            <Instance
              key={`${index}-${puffIndex}`}
              position={[
                position[0] + x * cloudScale,
                position[1] + y * cloudScale,
                position[2] + z * cloudScale,
              ]}
              scale={[
                size * cloudScale,
                size * 0.72 * cloudScale,
                size * 0.82 * cloudScale,
              ]}
            />
          ));
        })}
      </Instances>
      <Sparkles
        count={65}
        position={[0, 4, -42]}
        scale={[26, 13, 88]}
        size={2.2}
        speed={0.2}
        opacity={0.55}
        color="#fff4aa"
      />
      </group>
    </>
  );
}

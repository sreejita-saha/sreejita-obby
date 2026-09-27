// Non-interactive background scenery. Cloud positions are configured in data/world.ts.
import { Instance, Instances } from "@react-three/drei";
import { cloudPositions } from "../../data/world";

// Simple three-puff clouds, with small variations so the sky feels less repeated.
const cloudPuffs = [
  [[-0.9, 0, 0, 1.05], [0, 0.4, 0, 1.4], [0.9, 0, 0, 1.05]],
  [[-0.85, 0, 0, 0.95], [0.05, 0.34, 0, 1.25], [0.95, 0.08, 0, 1.1]],
  [[-1, 0.05, 0, 1.15], [0, 0.48, 0, 1.35], [0.95, -0.02, 0, 0.95]],
  [[-0.95, -0.03, 0, 0.9], [0, 0.38, 0, 1.5], [1.05, 0.02, 0, 1]],
  [[-0.85, 0, 0, 1], [0, 0.46, 0, 1.3], [0.9, 0.08, 0, 1.1]],
] as const;

export function Decorations() {
  return (
    <>
      {/* One shared sphere geometry and material for every cloud puff. */}
      <Instances limit={cloudPositions.length * 3}>
        <sphereGeometry args={[1, 16, 12]} />
        <meshStandardMaterial color="#ffffff" roughness={0.9} />
        {cloudPositions.flatMap((position, index) => {
          const cloudScale = 1.25 + (index % 2) * 0.25;
          return cloudPuffs[index].map(([x, y, z, size], puffIndex) => (
            <Instance
              key={`${index}-${puffIndex}`}
              position={[position[0] + x * cloudScale, position[1] + y * cloudScale, position[2] + z * cloudScale]}
              scale={[size * cloudScale, size * 0.72 * cloudScale, size * 0.82 * cloudScale]}
            />
          ));
        })}
      </Instances>
      <mesh position={[0, -7, -22]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[100, 100]} />
        <meshBasicMaterial color="#b8e8ff" />
      </mesh>
    </>
  );
}

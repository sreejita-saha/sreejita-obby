import * as THREE from "three";

type CheckpointFlagProps = {
  position: [number, number, number];
  color: string;
};

/** The small flag beside each checkpoint. Tweak the pole, flag size, and materials here. */
export function CheckpointFlag({ position, color }: CheckpointFlagProps) {
  const [x, top, z] = position;

  return (
    <group position={[x, top, z]}>
      {/* Flag pole */}
      <mesh position={[0, 0.65, 0]}>
        <cylinderGeometry args={[0.035, 0.035, 1.3, 8]} />
        <meshStandardMaterial color="#f7f1df" />
      </mesh>
      {/* Triangular pennant. Change 0.28 for a larger or smaller triangle. */}
      <mesh position={[0.15, 1, 0]} rotation={[0, 0, 0]}>
        <circleGeometry args={[0.28, 3]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.35} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

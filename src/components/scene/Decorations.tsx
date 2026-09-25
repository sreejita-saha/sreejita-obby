import { cloudPositions } from "../../data/world";

export function Decorations() {
  return (
    <>
      {cloudPositions.map((position, index) => (
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

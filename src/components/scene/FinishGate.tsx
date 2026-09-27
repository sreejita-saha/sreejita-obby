import type { Vector3Tuple } from "../../types/world";

type FinishGateProps = { position: Vector3Tuple };

/** Chequered finish-line gate matching the simple race arch reference. */
export function FinishGate({ position }: FinishGateProps) {
  const postHeight = 4;
  const gateWidth = 4.6;
  const checkerColumns = Array.from({ length: 8 }, (_, index) => index);
  const checkerRows = Array.from({ length: 2 }, (_, index) => index);
  const tileWidth = gateWidth / checkerColumns.length;
  const tileHeight = 0.5;

  return (
    <group position={position}>
      {/* Tall plain-black uprights match the reference without extra decoration. */}
      {[-2.45, 2.45].map((offsetX) => (
        <mesh key={offsetX} position={[offsetX, postHeight / 2, 0]} castShadow>
          <boxGeometry args={[0.24, postHeight, 0.24]} />
          <meshStandardMaterial color="#17191b" roughness={0.82} />
        </mesh>
      ))}

      {/* Two rows of black-and-white squares form the overhead finish banner. */}
      <group position={[0, 3.3, 0.13]}>
        {checkerRows.map((row) =>
          checkerColumns.map((column) => (
            <mesh
              key={`${row}-${column}`}
              position={[-gateWidth / 2 + tileWidth * (column + 0.5), tileHeight * (0.5 - row), 0]}
            >
              <planeGeometry args={[tileWidth, tileHeight]} />
              <meshBasicMaterial color={(row + column) % 2 === 0 ? "#f8f8f5" : "#17191b"} />
            </mesh>
          )),
        )}
      </group>

      {/* Matching chequered strip on the platform floor, directly below the banner. */}
      <group position={[0, 0.025, 0.15]}>
        {checkerRows.map((row) =>
          checkerColumns.map((column) => (
            <mesh
              key={`${row}-${column}`}
              position={[-gateWidth / 2 + tileWidth * (column + 0.5), 0, -0.58 + row * 0.58]}
              rotation={[-Math.PI / 2, 0, 0]}
            >
              <planeGeometry args={[tileWidth, 0.58]} />
              <meshBasicMaterial color={(row + column) % 2 === 0 ? "#f8f8f5" : "#17191b"} />
            </mesh>
          )),
        )}
      </group>

    </group>
  );
}

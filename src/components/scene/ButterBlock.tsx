// Visual treatment for `surface: "butter"` stepping stones.
import { RoundedBox, Text } from "@react-three/drei";
import type { Vector3Tuple } from "../../types/world";

type ButterBlockProps = {
  position: Vector3Tuple;
  size: Vector3Tuple;
  color: string;
};

/** A soft, branded butter bar used as a playful stepping platform. */
export function ButterBlock({ position, size, color }: ButterBlockProps) {
  const [x, y, z] = position;
  const [, height] = size;

  return (
    <group>
      <RoundedBox
        args={size}
        radius={0.1}
        smoothness={6}
        position={position}
        receiveShadow
        castShadow
      >
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.12}
          roughness={0.42}
        />
      </RoundedBox>
      <mesh position={[x, y + height / 2 + 0.012, z]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[size[0], size[2] * 0.9]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.1} />
      </mesh>
      <Text
        position={[x, y + height / 2 + 0.022, z]}
        rotation={[-Math.PI / 2, 0, 0]}
        fontSize={0.22}
        color="#143b73"
        anchorX="center"
        anchorY="middle"
      >
        4oz BUTTER
      </Text>
    </group>
  );
}

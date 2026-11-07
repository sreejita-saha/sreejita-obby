import { RoundedBox, Text } from "@react-three/drei";

type QuoteBoardProps = {
  position: [number, number, number];
  rotation?: [number, number, number];
  quote: string;
  author: string;
};

/** A freestanding, readable wooden sign for a checkpoint platform. */
export function QuoteBoard({
  position,
  rotation = [0, 0, 0],
  quote,
  author,
}: QuoteBoardProps) {
  return (
    <group position={position} rotation={rotation}>
      {/* Single centered wooden support. Change its height in the second boxGeometry value. */}
      <mesh position={[0, 0.5, -0.05]} castShadow>
        <boxGeometry args={[0.12, 1.06, 0.12]} />
        <meshStandardMaterial color="#b54b1e" roughness={0.9} />
      </mesh>

      {/* Dark wooden outer frame: args are [width, height, depth]. */}
      <RoundedBox
        args={[1.5, 0.9, 0.1]}
        radius={0.06}
        smoothness={4}
        position={[0, 0.96, 0]}
        castShadow
      >
        <meshStandardMaterial color="#b54b1e" roughness={0.88} />
      </RoundedBox>
      {/* Cream paper inset. Make this smaller to create a thicker wood border. */}
      <RoundedBox
        args={[1.3, 0.735, 0.04]}
        radius={0.025}
        smoothness={3}
        position={[0, 0.96, 0.09]}
        castShadow
      >
        <meshStandardMaterial color="#fff1cf" roughness={0.98} />
      </RoundedBox>

      {/* Main quote text. fontSize and maxWidth are the primary readability controls. */}
      <Text
        position={[0, 1.03, 0.115]}
        fontStyle="italic"
        fontSize={0.115}
        maxWidth={1.16}
        lineHeight={1.16}
        textAlign="center"
        anchorX="center"
        anchorY="middle"
        color="#24170f"
      >
        {quote}
      </Text>
      {/* Attribution line under the quote. */}
      <Text
        position={[0, 0.72, 0.115]}
        fontSize={0.09}
        anchorX="center"
        anchorY="middle"
        color="#24170f"
      >
        {author}
      </Text>
    </group>
  );
}

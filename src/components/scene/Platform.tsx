import { Float, Html, RoundedBox } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import { portfolio } from "../../data/portfolio";
import type { PlatformData } from "../../types/world";
import { SceneModel } from "./SceneModel";

type PlatformProps = {
  data: PlatformData;
  showLabel: boolean;
};

export function Platform({ data, showLabel }: PlatformProps) {
  const section = data.section === undefined ? undefined : portfolio[data.section];
  const labelSide = data.section !== undefined && data.section % 2 === 0 ? -1 : 1;
  const [width, height, depth] = data.size;
  const [x, y, z] = data.position;
  const top = y + height / 2;
  const labelX = x + labelSide * (width / 2 + 1.5);
  const [modelOffsetX, modelOffsetY, modelOffsetZ] = data.modelLabelOffset ?? [0, 0.25, 0];

  return (
    <group>
      <RoundedBox args={data.size} radius={0.16} smoothness={4} position={data.position} receiveShadow castShadow>
        <meshStandardMaterial color={data.color} roughness={0.72} />
      </RoundedBox>
      <mesh position={[x, top + 0.025, z]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[width * 0.82, depth * 0.82]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.08} />
      </mesh>
      {section && (
        <>
          <CheckpointMarker position={[x, top, z]} radius={Math.min(width, depth) * 0.25} color={data.color} />
          <CheckpointFlag position={[x + labelSide * (width * 0.35), top, z]} color={data.color} />
          <Float speed={1.5} rotationIntensity={0} floatIntensity={0.16}>
            {data.model && <SceneModel {...data.model} position={[labelX + modelOffsetX, top + modelOffsetY, z + modelOffsetZ]} anchor="top" />}
          </Float>
        </>
      )}
      {showLabel && section && (
        <Html
          position={[
            labelX,
            data.position[1] + data.size[1] / 2 + 1.8,
            data.position[2],
          ]}
          center
          distanceFactor={8}
          transform
          occlude
          pointerEvents="none"
        >
          <div className="world-label">
            <span>{section.kicker}</span>
            {section.title}
          </div>
        </Html>
      )}
    </group>
  );
}

function CheckpointMarker({ position, radius, color }: { position: [number, number, number]; radius: number; color: string }) {
  const ring = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (!ring.current) return;
    const pulse = 1 + Math.sin(clock.elapsedTime * 3) * 0.08;
    ring.current.scale.setScalar(pulse);
  });
  return <><pointLight position={[position[0], position[1] + 1.2, position[2]]} color={color} intensity={1.2} distance={4} /><mesh ref={ring} position={[position[0], position[1] + 0.05, position[2]]} rotation={[-Math.PI / 2, 0, 0]}><ringGeometry args={[radius * 0.82, radius, 32]} /><meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.5} transparent opacity={0.9} /></mesh></>;
}

function CheckpointFlag({ position, color }: { position: [number, number, number]; color: string }) {
  const [x, top, z] = position;
  return <group position={[x, top, z]}><mesh position={[0, 0.65, 0]}><cylinderGeometry args={[0.035, 0.035, 1.3, 8]} /><meshStandardMaterial color="#f7f1df" /></mesh><mesh position={[0.24, 0.95, 0]}><planeGeometry args={[0.48, 0.3]} /><meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.35} side={THREE.DoubleSide} /></mesh></group>;
}

import { Html } from "@react-three/drei";
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

  return (
    <group>
      {data.model ? (
        <SceneModel
          {...data.model}
          position={[data.position[0], data.position[1] + data.size[1] / 2, data.position[2]]}
          anchor="top"
        />
      ) : (
        <mesh position={data.position} receiveShadow castShadow>
          <boxGeometry args={data.size} />
          <meshStandardMaterial color={data.color} roughness={0.72} />
        </mesh>
      )}
      {showLabel && section && (
        <Html
          position={[
            data.position[0] + labelSide * (data.size[0] / 2 + 1.5),
            data.position[1] + data.size[1] / 2 + 0.75,
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

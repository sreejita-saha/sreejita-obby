// Root of the 3D scene: lighting, static decoration, platforms, and player.
import { Suspense, useEffect } from "react";
import { useThree } from "@react-three/fiber";
import { Decorations } from "./Decorations";
import { checkpointAreas } from "../../data/world";
import { Platform } from "./Platform";
import { Player, type PlayerProps } from "./Player";
import { preloadSceneModels } from "./SceneModel";

const sceneModelUrls = [
  ...new Set(
    checkpointAreas.flatMap((area) =>
      area.platforms.flatMap((platform) => [
        ...(platform.model ? [platform.model.url] : []),
        ...(platform.scenery?.map((model) => model.url) ?? []),
        ...(platform.surface === "grass" ? ["/models/grass.glb"] : []),
      ]),
    ),
  ),
];

type ObbySceneProps = PlayerProps & {
  /** Explicit label clicks should always open their checkpoint modal. */
  onOpenCheckpoint: (index: number) => void;
  onOpenCredits: () => void;
};

export function ObbyScene(props: ObbySceneProps) {
  const { playing } = props;
  const { gl } = useThree();

  // Start every model and texture decode while the full-page loader is still up.
  useEffect(() => {
    preloadSceneModels(sceneModelUrls, gl);
  }, [gl]);

  return (
    <>
      <color attach="background" args={["#87ceeb"]} />
      {/* Keep nearby platforms crisp while softening the distant route. */}
      <fog attach="fog" args={["#87ceeb", 16, 48]} />
      <ambientLight intensity={1.2} />
      <directionalLight
        position={[8, 15, 7]}
        intensity={2.8}
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      <hemisphereLight args={["#dff5ff", "#6fae67", 1.2]} />

      <Decorations />
      {checkpointAreas.map((area) => (
        <Suspense key={area.id} fallback={null}>
          <CheckpointArea
            key={area.id}
            area={area}
            showLabel={playing}
            onOpenCheckpoint={props.onOpenCheckpoint}
            onOpenCredits={props.onOpenCredits}
          />
        </Suspense>
      ))}
      <Player {...props} />
    </>
  );
}

type CheckpointAreaProps = {
  area: (typeof checkpointAreas)[number];
  showLabel: boolean;
  onOpenCheckpoint: (index: number) => void;
  onOpenCredits: () => void;
};

function CheckpointArea({
  area,
  showLabel,
  onOpenCheckpoint,
  onOpenCredits,
}: CheckpointAreaProps) {
  return (
    <group>
      {area.platforms.map((platform) => (
        <Platform
          key={platform.id}
          data={platform}
          showLabel={showLabel}
          onOpenCheckpoint={
            platform.section === undefined
              ? undefined
              : () => onOpenCheckpoint(platform.section!)
          }
          onOpenCredits={platform.finishGate ? onOpenCredits : undefined}
        />
      ))}
    </group>
  );
}

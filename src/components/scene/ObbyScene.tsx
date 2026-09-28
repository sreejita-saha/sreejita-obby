// Root of the 3D scene: lighting, static decoration, platforms, and player.
import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { Decorations } from "./Decorations";
import { checkpointAreas } from "../../data/world";
import { Platform } from "./Platform";
import { Player, type PlayerProps } from "./Player";
import { preloadSceneModels } from "./SceneModel";

type ObbySceneProps = PlayerProps & {
  /** Explicit label clicks should always open their checkpoint modal. */
  onOpenCheckpoint: (index: number) => void;
};

export function ObbyScene(props: ObbySceneProps) {
  const { playing } = props;
  const { gl } = useThree();
  // Area 0 is the start; every later area corresponds to checkpoint + 1.
  const currentArea = Math.max(0, props.checkpoint + 1);
  // Keep two upcoming areas visible so the route does not pop in as the player
  // reaches a checkpoint. Area-level frustum culling still avoids off-camera work.
  const visibleAreas = checkpointAreas.slice(currentArea, currentArea + 3);

  // Preload the area after the visible group while the player approaches it.
  useEffect(() => {
    const upcomingArea = checkpointAreas[currentArea + 3];
    if (upcomingArea) preloadSceneModels(getModelUrls(upcomingArea), gl);
  }, [currentArea, gl]);

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
      {visibleAreas.map((area) => (
        <CheckpointArea
          key={area.id}
          area={area}
          showLabel={playing}
          onOpenCheckpoint={props.onOpenCheckpoint}
        />
      ))}
      <Player {...props} />
    </>
  );
}

type CheckpointAreaProps = {
  area: (typeof checkpointAreas)[number];
  showLabel: boolean;
  onOpenCheckpoint: (index: number) => void;
};

/** Avoid submitting all of an off-camera area's static meshes to the renderer. */
function CheckpointArea({
  area,
  showLabel,
  onOpenCheckpoint,
}: CheckpointAreaProps) {
  const group = useRef<THREE.Group>(null);
  const lastCheck = useRef(-Infinity);
  const bounds = useRef(new THREE.Box3());
  const frustum = useRef(new THREE.Frustum());
  const projection = useRef(new THREE.Matrix4());

  useFrame(({ camera, clock }) => {
    if (!group.current || clock.elapsedTime - lastCheck.current < 0.15) return;
    lastCheck.current = clock.elapsedTime;
    group.current.updateWorldMatrix(true, true);
    bounds.current.setFromObject(group.current);
    projection.current.multiplyMatrices(
      camera.projectionMatrix,
      camera.matrixWorldInverse,
    );
    frustum.current.setFromProjectionMatrix(projection.current);
    group.current.visible =
      bounds.current.isEmpty() || frustum.current.intersectsBox(bounds.current);
  });

  return (
    <group ref={group}>
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
        />
      ))}
    </group>
  );
}

function getModelUrls(area: (typeof checkpointAreas)[number]) {
  return area.platforms.flatMap((platform) => [
    ...(platform.model ? [platform.model.url] : []),
    ...(platform.scenery?.map((model) => model.url) ?? []),
    ...(platform.surface === "grass" ? ["/models/grass.glb"] : []),
  ]);
}

// Root of the 3D scene: lighting, static decoration, platforms, and player.
import { Decorations } from "./Decorations";
import { platforms } from "../../data/world";
import { Platform } from "./Platform";
import { Player, type PlayerProps } from "./Player";

type ObbySceneProps = PlayerProps & {
  /** Explicit label clicks should always open their checkpoint modal. */
  onOpenCheckpoint: (index: number) => void;
};

export function ObbyScene(props: ObbySceneProps) {
  const { playing } = props;

  return (
    <>
      <color attach="background" args={["#87ceeb"]} />
      {/* Keep nearby platforms crisp while softening the distant route. */}
      <fog attach="fog" args={["#87ceeb", 16, 48]} />
      <ambientLight intensity={1.2} />
      <directionalLight position={[8, 15, 7]} intensity={2.8} castShadow shadow-mapSize={[1024, 1024]} />
      <hemisphereLight args={["#dff5ff", "#6fae67", 1.2]} />

      <Decorations />
      {platforms.map((platform) => (
        <Platform
          key={platform.id}
          data={platform}
          showLabel={playing}
          onOpenCheckpoint={platform.section === undefined ? undefined : () => props.onOpenCheckpoint(platform.section!)}
        />
      ))}
      <Player {...props} />
    </>
  );
}

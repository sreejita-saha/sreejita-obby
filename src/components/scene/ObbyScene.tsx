import { Decorations } from "./Decorations";
import { platforms } from "../../data/world";
import { Platform } from "./Platform";
import { Player, type PlayerProps } from "./Player";

export function ObbyScene({ playing, checkpoint, onCheckpoint }: PlayerProps) {
  return (
    <>
      <color attach="background" args={["#87ceeb"]} />
      <fog attach="fog" args={["#87ceeb", 24, 72]} />
      <ambientLight intensity={1.8} />
      <directionalLight position={[8, 15, 7]} intensity={2.8} castShadow shadow-mapSize={[1024, 1024]} />
      <hemisphereLight args={["#dff5ff", "#6fae67", 1.2]} />

      <Decorations />
      {platforms.map((platform, index) => <Platform key={index} data={platform} />)}
      <Player playing={playing} checkpoint={checkpoint} onCheckpoint={onCheckpoint} />
    </>
  );
}

import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import { platforms, spawnPoint } from "../../data/world";
import { Noob } from "./Noob";

export type PlayerProps = {
  playing: boolean;
  checkpoint: number;
  onCheckpoint: (index: number) => void;
};

export function Player({ playing, checkpoint, onCheckpoint }: PlayerProps) {
  const group = useRef<THREE.Group>(null);
  const velocity = useRef(new THREE.Vector3());
  const position = useRef(spawnPoint.clone());
  const keys = useRef(new Set<string>());
  const grounded = useRef(false);
  const jumpHeld = useRef(false);
  const facing = useRef(Math.PI);
  const { camera } = useThree();

  const respawn = () => {
    const checkpointPlatform = platforms.find((platform) => platform.section === checkpoint);

    position.current.set(
      checkpointPlatform?.position[0] ?? spawnPoint.x,
      checkpointPlatform
        ? checkpointPlatform.position[1] + checkpointPlatform.size[1] / 2 + 1.1
        : spawnPoint.y,
      checkpointPlatform?.position[2] ?? spawnPoint.z,
    );
    velocity.current.set(0, 0, 0);
  };

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      keys.current.add(event.code);
      if (["Space", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(event.code)) {
        event.preventDefault();
      }
      if (event.code === "KeyR") respawn();
    };
    const onKeyUp = (event: KeyboardEvent) => keys.current.delete(event.code);

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  });

  useFrame((_, rawDelta) => {
    if (!group.current) return;

    const delta = Math.min(rawDelta, 0.035);
    const move = new THREE.Vector3();

    if (playing) {
      if (keys.current.has("KeyW") || keys.current.has("ArrowUp")) move.z -= 1;
      if (keys.current.has("KeyS") || keys.current.has("ArrowDown")) move.z += 1;
      if (keys.current.has("KeyA") || keys.current.has("ArrowLeft")) move.x -= 1;
      if (keys.current.has("KeyD") || keys.current.has("ArrowRight")) move.x += 1;

      if (move.lengthSq()) {
        move.normalize();
        velocity.current.x = THREE.MathUtils.lerp(velocity.current.x, move.x * 5.2, 0.2);
        velocity.current.z = THREE.MathUtils.lerp(velocity.current.z, move.z * 5.2, 0.2);
        facing.current = Math.atan2(move.x, move.z);
      } else {
        velocity.current.x *= 0.82;
        velocity.current.z *= 0.82;
      }

      const wantsJump = keys.current.has("Space");
      if (wantsJump && grounded.current && !jumpHeld.current) {
        velocity.current.y = 7.2;
        grounded.current = false;
      }
      jumpHeld.current = wantsJump;
    } else {
      velocity.current.x *= 0.8;
      velocity.current.z *= 0.8;
    }

    velocity.current.y -= 18 * delta;
    const previousY = position.current.y;
    position.current.addScaledVector(velocity.current, delta);
    grounded.current = false;

    for (const platform of platforms) {
      const [platformX, platformY, platformZ] = platform.position;
      const [width, height, depth] = platform.size;
      const platformTop = platformY + height / 2;
      const feet = position.current.y - 0.9;
      const previousFeet = previousY - 0.9;
      const isOverPlatform =
        Math.abs(position.current.x - platformX) < width / 2 + 0.28 &&
        Math.abs(position.current.z - platformZ) < depth / 2 + 0.28;

      if (isOverPlatform && velocity.current.y <= 0 && previousFeet >= platformTop - 0.12 && feet <= platformTop) {
        position.current.y = platformTop + 0.9;
        velocity.current.y = 0;
        grounded.current = true;

        if (platform.section !== undefined && platform.section > checkpoint) {
          onCheckpoint(platform.section);
        }
      }
    }

    if (position.current.y < -8) respawn();

    group.current.position.copy(position.current);
    group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, facing.current, 0.18);

    const targetCameraPosition = position.current.clone().add(new THREE.Vector3(0, 3.8, 7.5));
    camera.position.lerp(targetCameraPosition, 1 - Math.pow(0.001, delta));
    camera.lookAt(position.current.x, position.current.y + 0.7, position.current.z - 2.2);
  });

  return (
    <group ref={group}>
      <Noob intro={!playing} />
      {!playing && (
        <Html position={[0, 2.25, 0]} center>
          <div className="speech">Hi, I’m Sreejita! 👋</div>
        </Html>
      )}
    </group>
  );
}

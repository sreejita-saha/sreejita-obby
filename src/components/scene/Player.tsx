import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import { platforms, spawnPoint } from "../../data/world";
import { Noob } from "./Noob";

export type PlayerProps = {
  playing: boolean;
  showIntro: boolean;
  checkpoint: number;
  onCheckpoint: (index: number) => void;
  onRestart: () => void;
  onBack: () => void;
  resetKey: number;
};

export function Player({
  playing,
  showIntro,
  checkpoint,
  onCheckpoint,
  onRestart,
  onBack,
  resetKey,
}: PlayerProps) {
  const group = useRef<THREE.Group>(null);
  const velocity = useRef(new THREE.Vector3());
  const position = useRef(spawnPoint.clone());
  const keys = useRef(new Set<string>());
  const grounded = useRef(false);
  const jumpHeld = useRef(false);
  const facing = useRef(Math.PI);
  const wasShowingIntro = useRef(showIntro);
  const previousResetKey = useRef(resetKey);
  const { camera } = useThree();

  const moveToCheckpoint = (checkpointIndex: number) => {
    const checkpointPlatform = platforms.find((platform) => platform.section === checkpointIndex);

    position.current.set(
      checkpointPlatform?.position[0] ?? spawnPoint.x,
      checkpointPlatform
        ? checkpointPlatform.position[1] + checkpointPlatform.size[1] / 2 + 1.1
        : spawnPoint.y,
      checkpointPlatform?.position[2] ?? spawnPoint.z,
    );
    velocity.current.set(0, 0, 0);
    facing.current = Math.PI;
  };

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      keys.current.add(event.code);
      if (["Space", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(event.code)) {
        event.preventDefault();
      }
      if (!playing || event.repeat) return;
      if (event.code === "KeyR") onRestart();
      if (event.code === "KeyB") onBack();
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

    if (previousResetKey.current !== resetKey) {
      previousResetKey.current = resetKey;
      moveToCheckpoint(checkpoint);
    }

    // Face the visitor during the greeting, then turn toward the first jump.
    if (showIntro) {
      facing.current = 0;
    } else if (wasShowingIntro.current) {
      facing.current = Math.PI;
    }
    wasShowingIntro.current = showIntro;

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

    // Falling is a checkpoint respawn. Only the R key restarts the full obby.
    if (position.current.y < -8) moveToCheckpoint(checkpoint);

    group.current.position.copy(position.current);
    const turnDifference = Math.atan2(
      Math.sin(facing.current - group.current.rotation.y),
      Math.cos(facing.current - group.current.rotation.y),
    );
    group.current.rotation.y += turnDifference * (1 - Math.exp(-6 * delta));

    // Keep the camera behind the route, rather than rotating every time the player turns.
    const targetCameraPosition = position.current.clone().add(new THREE.Vector3(0, 3.8, 7.5));
    const lookAtTarget = position.current.clone().add(new THREE.Vector3(0, 0.7, -2.2));
    camera.position.lerp(targetCameraPosition, 1 - Math.pow(0.001, delta));
    camera.lookAt(lookAtTarget);
  });

  return (
    <group ref={group}>
      <Noob intro={showIntro} />
      {showIntro && (
        <Html position={[0, 2.25, 0]} center>
          <div className="speech">Hi, I’m Sreejita! 👋</div>
        </Html>
      )}
    </group>
  );
}

// Player movement, collision, respawning, and camera follow. Tune gameplay here.
import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
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
  const virtualKeyCounts = useRef(new Map<string, number>());
  const grounded = useRef(false);
  const coyoteTime = useRef(0);
  const jumpBufferTime = useRef(0);
  const facing = useRef(Math.PI);
  const move = useRef(new THREE.Vector3());
  const cameraTarget = useRef(new THREE.Vector3());
  const cameraLookAt = useRef(new THREE.Vector3());
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
    const setVirtualKey = (event: Event, pressed: boolean) => {
      const code = (event as CustomEvent<string>).detail;
      if (typeof code !== "string") return;
      const currentCount = virtualKeyCounts.current.get(code) ?? 0;
      if (pressed) {
        virtualKeyCounts.current.set(code, currentCount + 1);
      } else if (currentCount <= 1) {
        virtualKeyCounts.current.delete(code);
      } else {
        virtualKeyCounts.current.set(code, currentCount - 1);
      }
    };
    const onKeyDown = (event: KeyboardEvent) => {
      // Let form fields use their normal keyboard input instead of treating
      // spaces and arrow keys as game controls.
      const target = event.target as HTMLElement | null;
      if (target?.matches("input, textarea, select, [contenteditable='true']")) return;

      keys.current.add(event.code);
      if (["Space", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(event.code)) {
        event.preventDefault();
      }
      if (!playing || event.repeat) return;
      if (event.code === "KeyR") onRestart();
      if (event.code === "KeyB") onBack();
    };
    const onKeyUp = (event: KeyboardEvent) => keys.current.delete(event.code);
    const clearKeys = () => {
      keys.current.clear();
      virtualKeyCounts.current.clear();
    };
    const onVirtualControlStart = (event: Event) => setVirtualKey(event, true);
    const onVirtualControlEnd = (event: Event) => setVirtualKey(event, false);

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("obby-control-start", onVirtualControlStart);
    window.addEventListener("obby-control-end", onVirtualControlEnd);
    window.addEventListener("blur", clearKeys);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("obby-control-start", onVirtualControlStart);
      window.removeEventListener("obby-control-end", onVirtualControlEnd);
      window.removeEventListener("blur", clearKeys);
    };
  });

  useFrame((_, rawDelta) => {
    if (!group.current) return;

    const delta = Math.min(rawDelta, 0.035);
    const movement = move.current.set(0, 0, 0);

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
      const isPressed = (code: string) =>
        keys.current.has(code) || virtualKeyCounts.current.has(code);
      if (isPressed("KeyW") || isPressed("ArrowUp")) movement.z -= 1;
      if (isPressed("KeyS") || isPressed("ArrowDown")) movement.z += 1;
      if (isPressed("KeyA") || isPressed("ArrowLeft")) movement.x -= 1;
      if (isPressed("KeyD") || isPressed("ArrowRight")) movement.x += 1;

      if (movement.lengthSq()) {
        movement.normalize();
        velocity.current.x = THREE.MathUtils.lerp(velocity.current.x, movement.x * 5.2, 0.2);
        velocity.current.z = THREE.MathUtils.lerp(velocity.current.z, movement.z * 5.2, 0.2);
        facing.current = Math.atan2(movement.x, movement.z);
      } else {
        velocity.current.x *= 0.82;
        velocity.current.z *= 0.82;
      }

      const wantsJump = isPressed("Space");
      // Buffer a slightly early press, and allow a brief jump after walking
      // off an edge. This feels much more responsive without enabling flight.
      if (wantsJump) jumpBufferTime.current = 0.12;
      jumpBufferTime.current = Math.max(0, jumpBufferTime.current - delta);
      if (jumpBufferTime.current > 0 && coyoteTime.current > 0) {
        velocity.current.y = 7.2;
        grounded.current = false;
        coyoteTime.current = 0;
        jumpBufferTime.current = 0;
      }
    } else {
      velocity.current.x *= 0.8;
      velocity.current.z *= 0.8;
    }

    velocity.current.y -= 18 * delta;
    const previousY = position.current.y;
    position.current.addScaledVector(velocity.current, delta);
    const wasGrounded = grounded.current;
    grounded.current = false;

    for (const platform of platforms) {
      if (platform.collidable === false) continue;
      const [platformX, platformY, platformZ] = platform.position;
      const [width, height, depth] = platform.size;
      // The safe rope rises into checkpoint 5, so its walkable surface needs to
      // rise with it rather than behaving like a flat invisible plank.
      const platformTop = platform.rope
        ? ropeHeightAt(platform.rope.start, platform.rope.end, position.current.x, position.current.z)
        : platformY + height / 2;
      const feet = position.current.y - 0.9;
      const previousFeet = previousY - 0.9;
      const isOverPlatform = platform.rope
        ? isOverRope(platform.rope.start, platform.rope.end, position.current.x, position.current.z)
        : Math.abs(position.current.x - platformX) < width / 2 + 0.28 &&
          Math.abs(position.current.z - platformZ) < depth / 2 + 0.28;

      const isLanding = velocity.current.y <= 0 && previousFeet >= platformTop - 0.12 && feet <= platformTop;
      // Lets a player walk up a gently rising bridge / rope instead of clipping
      // into the destination platform's side and falling through the level.
      const isSmallStepUp = wasGrounded && platformTop > previousFeet && platformTop - previousFeet <= 0.2;

      if (isOverPlatform && (isLanding || isSmallStepUp)) {
        position.current.y = platformTop + 0.9;
        velocity.current.y = 0;
        grounded.current = true;
        coyoteTime.current = 0.1;

        if (platform.section !== undefined && platform.section > checkpoint) {
          onCheckpoint(platform.section);
        }
      }
    }

    if (!grounded.current) coyoteTime.current = Math.max(0, coyoteTime.current - delta);

    // Falling is a checkpoint respawn. Only the R key restarts the full obby.
    if (position.current.y < -8) moveToCheckpoint(checkpoint);


    group.current.position.copy(position.current);
    const turnDifference = Math.atan2(
      Math.sin(facing.current - group.current.rotation.y),
      Math.cos(facing.current - group.current.rotation.y),
    );
    group.current.rotation.y += turnDifference * (1 - Math.exp(-6 * delta));

    // Keep the camera behind the route, rather than rotating every time the player turns.
    const targetCameraPosition = cameraTarget.current.copy(position.current);
    targetCameraPosition.y += 3.8;
    targetCameraPosition.z += 7.5;
    const lookAtTarget = cameraLookAt.current.copy(position.current);
    lookAtTarget.y += 0.7;
    lookAtTarget.z -= 2.2;
    camera.position.lerp(targetCameraPosition, 1 - Math.pow(0.001, delta));
    camera.lookAt(lookAtTarget);
  });

  return (
    <group ref={group}>
      <Noob intro={showIntro} />
    </group>
  );
}

function ropeProgressAt(start: [number, number, number], end: [number, number, number], x: number, z: number) {
  const directionX = end[0] - start[0];
  const directionZ = end[2] - start[2];
  const lengthSquared = directionX ** 2 + directionZ ** 2;
  return THREE.MathUtils.clamp(((x - start[0]) * directionX + (z - start[2]) * directionZ) / lengthSquared, 0, 1);
}

function ropeHeightAt(start: [number, number, number], end: [number, number, number], x: number, z: number) {
  const progress = ropeProgressAt(start, end, x, z);
  // The rope tube is slightly thicker than its centre line, so stand on its top.
  return THREE.MathUtils.lerp(start[1], end[1], progress) + 0.105;
}

function isOverRope(start: [number, number, number], end: [number, number, number], x: number, z: number) {
  const progress = ropeProgressAt(start, end, x, z);
  const ropeX = THREE.MathUtils.lerp(start[0], end[0], progress);
  const ropeZ = THREE.MathUtils.lerp(start[2], end[2], progress);
  // The player is wider than the rendered rope, so use a small forgiving radius.
  return Math.hypot(x - ropeX, z - ropeZ) < 0.55;
}

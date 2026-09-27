// Scene-wide settings live here. Individual course layouts live in data/checkpoints/.
import * as THREE from "three";
import type { Vector3Tuple } from "../types/world";

export { checkpointAreas, platforms } from "./checkpoints";

// Change this [x, y, z] value to move the initial player spawn.
export const spawnPoint = new THREE.Vector3(0, 1.2, 2);

/** Ambient scene decoration, kept separate from level layout. */
export const cloudPositions: Vector3Tuple[] = [
  [-8, 3.6, -2],
  [7.5, 5.1, -12],
  [-5.5, 7.2, -25],
  [8.5, 6.3, -37],
  [-8, 9.2, -49],
];

// Scene-wide settings live here. Individual course layouts live in data/checkpoints/.
import * as THREE from "three";
import type { Vector3Tuple } from "../types/world";

export { checkpointAreas, platforms } from "./checkpoints";

// Change this [x, y, z] value to move the initial player spawn.
export const spawnPoint = new THREE.Vector3(0, 1.2, 2);

/** Ambient scene decoration, kept separate from level layout. */
export const cloudPositions: Vector3Tuple[] = [
  [-8, 4.2, -8],
  [8.5, 7, -40],
  [-8, 10, -78],
];

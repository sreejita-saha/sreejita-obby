// Scene-wide settings live here. Individual course layouts live in data/checkpoints/.
import * as THREE from "three";
import type { Vector3Tuple } from "../types/world";

export { checkpointAreas, platforms } from "./checkpoints";

// Change this [x, y, z] value to move the initial player spawn.
export const spawnPoint = new THREE.Vector3(0, 1.2, 7);

/** Ambient scene decoration, kept separate from level layout. */
export const cloudPositions: Vector3Tuple[] = [
  [-18, 12, -18],
  [18, 12, -20],
  [-21, 4, -30],
  [21, 4, -34],
  [-17, -5, -42],
  [17, -5, -46],
  [-16, 12, -56],
  [16, 12, -60],
  [-20, 4, -68],
  [20, 4, -72],
  [-15, -5, -82],
  [15, -5, -86],
  [-14, 12, -98],
  [14, 12, -102],
  [-18, 3, -112],
  [18, 3, -116],
];

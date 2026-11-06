// Scene-wide settings live here. Individual course layouts live in data/checkpoints/.
import * as THREE from "three";
import type { Vector3Tuple } from "../types/world";

export { checkpointAreas, platforms } from "./checkpoints";

// Change this [x, y, z] value to move the initial player spawn.
export const spawnPoint = new THREE.Vector3(0, 1.2, 2);

/** Ambient scene decoration, kept separate from level layout. */
export const cloudPositions: Vector3Tuple[] = [
  [-11, 12, -8],
  [12, -5, -18],
  [-14, -5, -28],
  [13, 13, -38],
  [-11, 11, -48],
  [12, -5, -58],
  [-13, -5, -68],
  [13, 12, -78],
  [-11, 11, -88],
  [12, -5, -98],
  [-13, -5, -108],
  [13, 12, -118],
  [-11, 11, -128],
  [12, -5, -138],
  [-13, -5, -148],
  [13, 12, -158],
];

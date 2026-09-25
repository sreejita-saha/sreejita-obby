import * as THREE from "three";
import { portfolio } from "./portfolio";
import type { PlatformData, Vector3Tuple } from "../types/world";

export const spawnPoint = new THREE.Vector3(0, 1.2, 2);

export const cloudPositions: Vector3Tuple[] = [
  [-8, 8, -8],
  [7, 11, -20],
  [-9, 13, -33],
  [8, 15, -45],
];

export const platforms: PlatformData[] = [
  { position: [0, -0.5, 2], size: [7, 1, 7], color: "#72d572" },
  { position: [0, 0.15, -4], size: [3.4, 0.6, 3.2], color: "#ffd84d" },
  { position: [2.2, 0.75, -8], size: [3.2, 0.6, 3], color: "#ff9c4a" },
  { position: [-0.4, 1.25, -12], size: [4.8, 0.7, 3.5], color: portfolio[0].color, section: 0 },
  { position: [-3, 1.75, -16], size: [3, 0.6, 3], color: "#ff9c4a" },
  {
    position: [0.2, 2.35, -20],
    size: [4.8, 0.7, 3.5],
    color: portfolio[1].color,
    section: 1,
    model: { url: "/models/book_n_pencil.glb", displaySize: 3.4 },
  },
  { position: [3.1, 2.9, -24], size: [3, 0.6, 3], color: "#ffd84d" },
  {
    position: [0.3, 3.5, -28],
    size: [4.8, 0.7, 3.5],
    color: portfolio[2].color,
    section: 2,
    model: {
      url: "/models/laptop.glb",
      displaySize: 2.7,
      rotation: [0, -Math.PI / 4, 0],
    },
  },
  { position: [-3, 4.05, -32], size: [3, 0.6, 3], color: "#ff9c4a" },
  { position: [0, 4.65, -36], size: [4.8, 0.7, 3.5], color: portfolio[3].color, section: 3 },
  { position: [3, 5.2, -40], size: [3, 0.6, 3], color: "#ffd84d" },
  { position: [0, 5.8, -44], size: [4.8, 0.7, 3.5], color: portfolio[4].color, section: 4 },
  { position: [-3, 6.35, -48], size: [3, 0.6, 3], color: "#ffd84d" },
  { position: [0, 6.95, -52], size: [7, 0.8, 6], color: portfolio[5].color, section: 5 },
];

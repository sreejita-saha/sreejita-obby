import * as THREE from "three";
import { portfolio } from "./portfolio";
import type { PlatformData, Vector3Tuple } from "../types/world";

export const spawnPoint = new THREE.Vector3(0, 1.2, 2);

export const cloudPositions: Vector3Tuple[] = [
  [-8, 3.6, -2],
  [7.5, 5.1, -12],
  [-5.5, 7.2, -25],
  [8.5, 6.3, -37],
  [-8, 9.2, -49],
];

export const platforms: PlatformData[] = [
  { position: [0, -0.5, 2], size: [7, 1, 7], color: "#5fbf62", surface: "baseplate" },
  { position: [0, 0.15, -4], size: [3.4, 0.6, 3.2], color: "#ffd84d", surface: "stone" },
  { position: [2.2, 0.75, -8], size: [3.2, 0.6, 3], color: "#72c95c", surface: "grass" },
  {
    position: [-0.4, 1.25, -12],
    size: [4.8, 0.7, 3.5],
    color: portfolio[0].color,
    surface: "flowers",
    section: 0,
  },
  { position: [-3, 1.75, -16], size: [3, 0.6, 3], color: "#ff9c4a", surface: "stone" },
  {
    position: [0.2, 2.35, -20],
    size: [4.8, 0.7, 3.5],
    color: portfolio[1].color,
    surface: "flowers",
    section: 1,
    model: { url: "/models/book_n_pencil.glb", displaySize: 3.4 },
    modelLabelOffset: [1.05, 0.25, 0],
  },
  { position: [3.1, 2.9, -24], size: [3, 0.6, 3], color: "#67c75c", surface: "grass" },
  {
    position: [0.3, 3.5, -28],
    size: [4.8, 0.7, 3.5],
    color: portfolio[2].color,
    surface: "flowers",
    section: 2,
    model: {
      url: "/models/laptop.glb",
      displaySize: 2.7,
      rotation: [0, Math.PI / 4, 0],
    },
    modelLabelOffset: [-1.05, 0.75, 0],
  },
  { position: [-3, 4.05, -32], size: [3, 0.6, 3], color: "#ff9c4a", surface: "stone" },
  { position: [0, 4.65, -36], size: [4.8, 0.7, 3.5], color: portfolio[3].color, surface: "flowers", section: 3 },
  { position: [3, 5.2, -40], size: [3, 0.6, 3], color: "#63c55e", surface: "grass" },
  { position: [0, 5.8, -44], size: [4.8, 0.7, 3.5], color: portfolio[4].color, surface: "flowers", section: 4 },
  { position: [-3, 6.35, -48], size: [2.4, 0.55, 2.4], color: "#838b96", surface: "stone" },
  { position: [0, 6.85, -51], size: [1.8, 0.5, 1.8], color: "#838b96", surface: "stone" },
  { position: [2.4, 7.3, -54], size: [1.7, 0.5, 1.7], color: "#838b96", surface: "stone" },
  { position: [-0.5, 7.8, -57], size: [1.8, 0.5, 1.8], color: "#838b96", surface: "stone" },
  { position: [0, 8.35, -61], size: [5.6, 0.8, 4.8], color: portfolio[5].color, surface: "flowers", section: 5 },
];

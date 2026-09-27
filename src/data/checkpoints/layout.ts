// Shared constructors for checkpoint data. Add a new reusable obstacle type here
// rather than repeating its defaults in every checkpoint file.
import { portfolio } from "../portfolio";
import type { PlatformData, Vector3Tuple } from "../../types/world";

export type CheckpointArea = { id: string; platforms: PlatformData[] };

type Layout = Omit<PlatformData, "id" | "position" | "size"> & {
  // `at` and `dimensions` are clearer names for authors than Three.js's data fields.
  at: Vector3Tuple;
  dimensions: Vector3Tuple;
};

/** Use this for any normal piece of level geometry. */
export function block(id: string, { at, dimensions, ...appearance }: Layout): PlatformData {
  return { id, position: at, size: dimensions, ...appearance };
}

/** A portfolio checkpoint. Its colour and section index come from portfolio.ts. */
export function checkpoint(section: number, layout: Omit<Layout, "color">): PlatformData {
  // `section` uses zero-based indexing: 0 is checkpoint 01, 1 is checkpoint 02, etc.
  return block(`checkpoint-${String(section + 1).padStart(2, "0")}`, {
    ...layout,
    color: portfolio[section].color,
    section,
  });
}

export function butterStone(id: string, at: Vector3Tuple, color: string): PlatformData {
  return block(id, { at, dimensions: [2, 0.55, 0.8], color, surface: "butter" });
}

export function balanceBeam(id: string, at: Vector3Tuple, dimensions: Vector3Tuple): PlatformData {
  return block(id, { at, dimensions, color: "#ff8fbe" });
}

export function rope(id: string, at: Vector3Tuple, start: Vector3Tuple, end: Vector3Tuple, collidable = true): PlatformData {
  return block(id, { at, dimensions: [0.42, 0.28, 5.8], color: "#9a6437", collidable, rope: { start, end } });
}

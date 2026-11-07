// This is the course order. To insert a checkpoint, create its file and add it
// to this list; ObbyScene and Player consume the flattened platform list below.
import { checkpoint01 } from "./checkpoint01";
import { checkpoint02 } from "./checkpoint02";
import { checkpoint03 } from "./checkpoint03";
import { checkpoint04 } from "./checkpoint04";
import { checkpoint05 } from "./checkpoint05";
import { checkpoint06 } from "./checkpoint06";
import { start } from "./start";
import type { PlatformData } from "../../types/world";

/** Level order. Add, remove, or reorder whole checkpoint modules here. */
export const checkpointAreas = [
  start,
  checkpoint01,
  checkpoint02,
  checkpoint03,
  checkpoint04,
  checkpoint05,
  checkpoint06,
];

/** Render-friendly form consumed by ObbyScene. */
export const platforms: PlatformData[] = checkpointAreas.flatMap(
  ({ platforms }) => platforms,
);

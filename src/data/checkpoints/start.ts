// The spawn island and the short route leading to checkpoint 01.
import { block, type CheckpointArea } from "./layout";

export const start: CheckpointArea = {
  id: "start",
  platforms: [
    block("start-platform", { at: [0, -0.5, 2], dimensions: [7, 1, 7], color: "#757575", surface: "baseplate" }),
    block("checkpoint-01-approach-a", { at: [0, 0.15, -4], dimensions: [3.4, 0.6, 3.2], color: "#f5828f", surface: "stone" }),
    block("checkpoint-01-approach-b", { at: [2.2, 0.75, -8], dimensions: [3.2, 0.6, 3], color: "#959cf7", surface: "stone" }),
  ],
};

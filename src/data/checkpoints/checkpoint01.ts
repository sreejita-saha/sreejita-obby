// Checkpoint 01's platform and its outgoing butter-stone route.
import { butterStone, checkpoint, type CheckpointArea } from "./layout";

/** Checkpoint 01 and its outgoing route to checkpoint 02. */
export const checkpoint01: CheckpointArea = {
  id: "checkpoint-01",
  platforms: [
    checkpoint(0, {
      at: [-0.4, 1.25, -12],
      dimensions: [4.8, 0.7, 3.5],
      surface: "flowers",
    }),
    butterStone("checkpoint-02-butter-01", [-0.7, 1.48, -15.25], "#f996c1"),
    butterStone("checkpoint-02-butter-02", [0.65, 1.65, -17.75], "#fddb87"),
    butterStone("checkpoint-02-butter-03", [-0.6, 1.82, -20.25], "#9abbfd"),
    butterStone("checkpoint-02-butter-04", [0.65, 1.99, -22.75], "#fedd8a"),
    butterStone("checkpoint-02-butter-05", [-0.4, 2.16, -25.25], "#ff9ec8"),
  ],
};

// Checkpoint 02's content and its route toward checkpoint 03.
import { block, checkpoint, type CheckpointArea } from "./layout";

export const checkpoint02: CheckpointArea = {
  id: "checkpoint-02",
  platforms: [
    checkpoint(1, { at: [0.2, 2.35, -28], dimensions: [4.8, 0.7, 3.5], surface: "flowers", model: { url: "/models/book_n_pencil.glb", displaySize: 3.4, rotation: [0, -2.5, 0] }, modelLabelOffset: [1.05, 0.25, 0] }),
    block("checkpoint-03-approach", { at: [-2, 2.9, -33], dimensions: [3, 0.6, 3], color: "#67c75c", surface: "grass" }),
    block("checkpoint-03-approach-b", { at: [1.7, 3.2, -37], dimensions: [2.4, 0.55, 2.2], color: "#67c75c", surface: "grass" }),
  ],
};

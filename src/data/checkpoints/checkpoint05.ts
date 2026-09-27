import { block, checkpoint, type CheckpointArea } from "./layout";

export const checkpoint05: CheckpointArea = {
  id: "checkpoint-05",
  platforms: [
    checkpoint(4, { at: [0, 5.9, -71.25], dimensions: [4.8, 0.7, 3.5], surface: "floating-stone" }),
    // Outgoing route to checkpoint 06.
    block("checkpoint-06-step-01", { at: [-3, 6.45, -75.25], dimensions: [2.4, 0.55, 2.4], color: "#838b96", surface: "floating-stone" }),
    block("checkpoint-06-step-02", { at: [0, 6.95, -78.25], dimensions: [1.8, 0.5, 1.8], color: "#838b96", surface: "floating-stone" }),
    block("checkpoint-06-step-03", { at: [2.4, 7.4, -81.25], dimensions: [1.7, 0.5, 1.7], color: "#838b96", surface: "floating-stone" }),
    block("checkpoint-06-step-04", { at: [-0.5, 7.9, -84.25], dimensions: [1.4, 0.5, 1.8], color: "#838b96", surface: "floating-stone" }),
  ],
};

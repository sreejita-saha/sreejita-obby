import { balanceBeam, checkpoint, type CheckpointArea } from "./layout";

export const checkpoint03: CheckpointArea = {
  id: "checkpoint-03",
  platforms: [
    checkpoint(2, {
      at: [0.3, 3.5, -40.95],
      dimensions: [5.6, 0.7, 4.1],
      surface: "grass",
      gardenDensity: "lush",
      model: {
        url: "/models/laptop.glb",
        displaySize: 2.7,
        rotation: [0, Math.PI / 4, 0],
      },
      modelLabelOffset: [-1.05, 0.75, 0],
      scenery: [
        {
          url: "/models/tree.glb",
          displaySize: 2.17,
          rotation: [0, Math.PI / 4, 0],
          position: [2.8, 4.2, -42.55],
        },
      ],
      quoteBoard: {
        quote: "Nature does not hurry, yet everything is accomplished.",
        author: "— Lao Tzu",
        positionOffset: [-0.2, -0.2, 0.4],
        rotation: [0, -0.29, 0],
      },
    }),
    // Outgoing balance-beam route to checkpoint 04.
    balanceBeam("checkpoint-03-obstacle-01", [0.15, 3.6, -44.15], [0.8, 0.5, 2.5]),
    balanceBeam("checkpoint-03-obstacle-02", [-1.25, 3.6, -45], [2.8, 0.5, 0.8]),
    balanceBeam("checkpoint-03-obstacle-03", [-2.25, 3.6, -46.7], [0.8, 0.5, 3.4]),
    balanceBeam("checkpoint-03-obstacle-04", [-0.05, 3.6, -48], [4.4, 0.5, 0.8]),
    balanceBeam("checkpoint-03-obstacle-05", [1.75, 3.6, -49.7], [0.8, 0.5, 3.4]),
    balanceBeam("checkpoint-03-obstacle-06", [0.95, 3.6, -51.05], [2.4, 0.5, 0.8]),
    balanceBeam("checkpoint-03-obstacle-07", [0.15, 3.6, -53.3], [0.8, 0.5, 4.2]),
  ],
};

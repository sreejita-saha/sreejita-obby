import { checkpoint, rope, type CheckpointArea } from "./layout";

export const checkpoint04: CheckpointArea = {
  id: "checkpoint-04",
  platforms: [
    checkpoint(3, {
      at: [0, 4.813, -59.2],
      dimensions: [9, 0.7, 9.2],
      surface: "bridge",
      markerColor: "#111111",
      scenery: [
        {
          url: "/models/japanese_arch.glb",
          displaySize: 10,
          rotation: [0, 0, 0],
          position: [0.03, 5, -62.3],
        },
      ],
      quoteBoard: {
        quote: "Chose Wisely",
        author: "",
        theme: "danger",
        fontSize: 0.16,
        boardHeight: 0.6,
        textOffsetY: -0.05,
        positionOffset: [-7, 0.1, 3],
        rotation: [0, 0.4, 0],
      },
    }),
    // Outgoing route to checkpoint 05. Only the right rope carries the player.
    rope(
      "checkpoint-05-rope-left",
      [-0.85, 5.2, -66.45],
      [-1.7, 5.18, -63.52],
      [-0.38, 6.25, -74.4],
      false,
    ),
    rope(
      "checkpoint-05-rope-centre",
      [0, 5.2, -66.45],
      [0, 5.18, -63.52],
      [0, 6.25, -74.4],
      false,
    ),
    rope(
      "checkpoint-05-rope-right",
      [0.85, 5.2, -66.45],
      [1.7, 5.18, -63.52],
      [0.38, 6.25, -74.4],
    ),
  ],
};

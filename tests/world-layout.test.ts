import { describe, expect, it } from "vitest";
import { checkpoint04 } from "../src/data/checkpoints/checkpoint04";
import { checkpoint05 } from "../src/data/checkpoints/checkpoint05";
import { checkpoint06 } from "../src/data/checkpoints/checkpoint06";

describe("final checkpoint layout", () => {
  it("keeps all three gate ropes extended to the moved toolkit stage", () => {
    const ropes = checkpoint04.platforms.filter((platform) => platform.rope);
    expect(ropes).toHaveLength(3);
    expect(ropes.map((platform) => platform.rope?.end[2])).toEqual([
      -74.4,
      -74.4,
      -74.4,
    ]);
  });

  it("moves the toolkit label clear of the gate and shifts later stages together", () => {
    expect(checkpoint05.platforms[0].worldLabelOffset).toEqual([-3, 0.2, 0]);
    expect(checkpoint05.platforms[0].position[2]).toBe(-76.25);
    expect(checkpoint06.platforms[0].position[2]).toBe(-93.25);
  });

  it("adds the warning board without changing the reusable board defaults", () => {
    expect(checkpoint04.platforms[0].quoteBoard).toMatchObject({
      quote: "Chose Wisely",
      theme: "danger",
    });
  });
});

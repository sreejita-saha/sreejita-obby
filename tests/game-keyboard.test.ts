import { describe, expect, it, vi } from "vitest";
import { releaseUiFocusForMovement } from "../src/utils/gameKeyboard";

describe("releaseUiFocusForMovement", () => {
  it("removes button focus for directional game keys", () => {
    const button = document.createElement("button");
    const blur = vi.spyOn(button, "blur");
    releaseUiFocusForMovement(new KeyboardEvent("keydown", { code: "ArrowUp" }));
    expect(blur).not.toHaveBeenCalled();

    button.dispatchEvent(new KeyboardEvent("keydown", { code: "ArrowUp" }));
    const event = new KeyboardEvent("keydown", { code: "ArrowUp" });
    Object.defineProperty(event, "target", { value: button });
    releaseUiFocusForMovement(event);
    expect(blur).toHaveBeenCalledOnce();
  });

  it("keeps focus for activation and unrelated keys", () => {
    const button = document.createElement("button");
    const blur = vi.spyOn(button, "blur");
    for (const code of ["Enter", "Space", "Escape"]) {
      const event = new KeyboardEvent("keydown", { code });
      Object.defineProperty(event, "target", { value: button });
      releaseUiFocusForMovement(event);
    }
    expect(blur).not.toHaveBeenCalled();
  });
});

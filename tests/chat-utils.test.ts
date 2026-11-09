import { describe, expect, it } from "vitest";
import { getPortfolioSectionId } from "../src/components/chat/chat.utils";

describe("getPortfolioSectionId", () => {
  it("maps known source metadata to portfolio sections", () => {
    expect(
      getPortfolioSectionId({ title: "Projects", source: "projects.md", similarity: 1 }),
    ).toBe("projects");
    expect(
      getPortfolioSectionId({
        title: "Profile",
        source: "cv.md",
        similarity: 1,
        metadata: { section: "Profile" },
      }),
    ).toBe("about");
  });

  it("returns undefined for unrelated content", () => {
    expect(
      getPortfolioSectionId({ title: "Other", source: "other.md", similarity: 0 }),
    ).toBeUndefined();
  });
});

import { describe, expect, it } from "vitest";
import { getPortfolioSectionId } from "./chat.utils";

describe("getPortfolioSectionId", () => {
  it.each([
    [{ title: "Projects", source: "projects.md", similarity: 1 }, "projects"],
    [{ title: "Course", source: "education.md", similarity: 1 }, "education"],
    [{ title: "Profile", source: "cv.md", similarity: 1, metadata: { section: "Profile" } }, "about"],
  ] as const)("maps %o to %s", (source, section) => {
    expect(getPortfolioSectionId(source)).toBe(section);
  });

  it("returns undefined for a source without a portfolio section", () => {
    expect(getPortfolioSectionId({ title: "Other", source: "other.md", similarity: 0 })).toBeUndefined();
  });
});

import { describe, it, expect } from "vitest";
import { Mf2Resource } from "../dist/index";

describe("Mf2Resource()", () => {
    it("creates and parses MF2 resources", () => {
        const src = `
@resourceTag resource
---

@sectionTag section
[my.section]

@entryTag entry
foo = bar
`;
        const res = new Mf2Resource(src, "en");

        expect("bar", res.getEntry("foo")?.value);
        expect(res.getEntry("foo")?.meta).toEqual(
            expect.arrayContaining([
                { key: "resourceTag", value: "resource" },
                { key: "sectionTag", value: "section" },
                { key: "entryTag", value: "entry" },
            ])
        );
    });
});

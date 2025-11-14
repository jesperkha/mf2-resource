import { describe, it, expect } from "vitest";
import { Mf2Resource } from "../dist/index";

describe("Mf2Resource", () => {
    it("parses MF2 resource strings", () => {
        const src = `
@resourceTag resource
---

entryOne = Some entry

@entryTag entry
entryTwo = Another entry
`;
        const res = new Mf2Resource(src, "en");

        expect("Some entry", res.getEntry("entryOne")?.value);
        expect(res.getEntry("entryTwo")?.meta).toEqual(
            expect.arrayContaining([
                { key: "resourceTag", value: "resource" },
                { key: "entryTag", value: "entry" },
            ])
        );
    });

    it("handles multiple sections with the same entry ids", () => {
        const src = `
---
sameEntry = This is the first

[my.section]

sameEntry = This is the second
`;
        const res = new Mf2Resource(src, "en");

        expect("This is the first", res.getEntry("sameEntry")?.value);
        expect("This is the second", res.getEntry("my.section.sameEntry")?.value);
    });
});

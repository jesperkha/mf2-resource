import { readFileSync } from "fs";
import type { Metadata, Resource } from "./resource";
import { parse } from "./parser";

/**
 * Entry describes a resource entry.
 */
type Entry = {
    /**
     * All metadata tags applied to the resource, the
     * section this entry is in, and the entry itself.
     */
    meta: Metadata[];
    /** The string value of the entry. */
    value: string;
};

/**
 * Resource contains one resource parsed from a file or string.
 */
export class Mf2Resource {
    private _locale: string;
    private rsrc: Resource;

    constructor(src: string = "", locale: string = "") {
        this.rsrc = parse(src);
        this._locale = locale;
    }

    /**
     * Load resource from file.
     * @param filepath Path to resource file
     * @param locale The files locale. Mf2Resource does not automatically set the
     *               resource locale based on the resource header metadata.
     * @param encoding The file encoding, defaults to utf-8
     * @returns New Mf2Resource
     */
    static fromFile(filepath: string, locale: string = "", encoding: BufferEncoding = "utf-8"): Mf2Resource {
        const data: string = readFileSync(filepath, encoding);
        return new Mf2Resource(data, locale);
    }

    /**
     * Get the underlying resource tree.
     * @returns Resource
     */
    parts(): Resource {
        return this.rsrc;
    }

    /**
     * Get this resources locale.
     * @returns locale
     */
    locale(): string {
        return this._locale;
    }

    /**
     * Get an entry from this resource.
     * @param name Name of entry.
     * @returns Entry type with value to the entrys value. The Entry meta
     *          array is all metadata tags applied to the resource, the section,
     *          and the entry itself.
     */
    getEntry(name: string): Entry | null {
        for (const section of this.parts().sections) {
            for (const entry of section.entries) {
                if (entry.type == "entry" && entry.id.join(".") === name) {
                    return {
                        value: entry.value,
                        meta: this.parts().meta.concat(section.meta).concat(entry.meta),
                    };
                }
            }
        }
        return null;
    }
}

/**
 * A Bundle contains one or more Resource, keeps track of locale, and fetches
 * entries from resources, respecting the current locale, or using the default
 * when entries are missing.
 */
export class Bundle {
    private defaultLocale: string;
    private locale: string;
    private sources: Record<string, Mf2Resource>;

    /**
     * Create new Bundle from Resources.
     * @param sources List of resources to include in bundle.
     */
    constructor(defaultLocale: string, ...sources: Mf2Resource[]) {
        this.defaultLocale = defaultLocale;
        this.locale = defaultLocale;
        this.sources = Object.fromEntries(sources.map((s) => [s.locale(), s]));
    }

    /**
     * Retrieves an entry from the bundle, adhering to the current locale setting.
     * If the entry is not found in the current locales resource the default locale is used.
     * @param name Name of entry in resource file
     * @returns Entry if found, else null
     */
    getEntry(name: string): Entry | null {
        let resource = this.sources[this.locale];
        if (!resource) {
            resource = this.sources[this.defaultLocale];
            if (!resource) return null;
        }

        return resource.getEntry(name);
    }

    /**
     * Sets the current locale.
     * @param locale Locale to set to. Does not validate if locale actually
     *               exists in bundle.
     */
    setLocale(locale: string) {
        this.locale = locale;
    }

    /**
     * Reports supported locales by this Bundle.
     * @returns List of supported locales.
     */
    getLocales(): string[] {
        return Object.keys(this.sources);
    }
}

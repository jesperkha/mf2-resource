import { readFileSync } from "fs";
import type { Resource } from "./resource.js";
import { parse } from "./parser.js";

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

    static fromFile(filepath: string, locale: string = "", encoding: BufferEncoding = "utf-8"): Mf2Resource {
        const data: string = readFileSync(filepath, encoding);
        return new Mf2Resource(data, locale);
    }

    parts(): Resource {
        return this.rsrc;
    }

    locale(): string {
        return this._locale;
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
     * @param name Name of entry in resource file
     * @returns Entry if found, else null
     */
    getEntry(name: string): null {
        return null;
    }

    /**
     * Sets the current locale.
     * @param locale Locale to set to. Does not validate if locale actually
     *               exists in bundle.
     */
    setLocale(locale: string) {}

    /**
     * Reports supported locales by this Bundle.
     * @returns List of supported locales.
     */
    getLocales(): string[] {
        return [];
    }
}

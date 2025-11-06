// /**
//  * Resource contains one resource source loaded from a file.
//  */
// export class Resource {
//     private locale: string;

//     constructor(filepath: string) {}
// }

// /**
//  * A Bundle contains one or more Resource, keeps track of locale, and fetches
//  * entries from resources, respecting the current locale, or using the default
//  * when entries are missing.
//  */
// export class Bundle {
//     private defaultLocale: string;
//     private locale: string;

//     /**
//      * Create new Bundle from Resources.
//      * @param sources List of resources to include in bundle.
//      */
//     constructor(defaultLocale: string, ...sources: Resource[]) {}

//     /**
//      * Retrieves an entry from the bundle, adhering to the current locale setting.
//      * @param name Name of entry in resource file
//      * @returns Entry if found, else null
//      */
//     getEntry(name: string): Entry | null {
//         return null;
//     }

//     /**
//      * Sets the current locale.
//      * @param locale Locale to set to. Does not validate if locale actually
//      *               exists in bundle.
//      */
//     setLocale(locale: string) {}

//     /**
//      * Reports supported locales by this Bundle.
//      * @returns List of supported locales.
//      */
//     getLocales(): string[] {}
// }

// export type Entry = {
//     locale: string;
//     name: string;
//     raw: string;
// };

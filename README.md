# MF2 Resource and Bundle

```sh
npm install mf2-resource
```

## About

This package provides utilities for loading, parsing, and bundling together multiple Message Format 2 resource files that use the [MF2 resource syntax](https://github.com/eemeli/message-resource-wg).

## Examples

```ts
/**
 * Using the Mf2Resource to get entries:
 */

import { Mf2Resource } from "mf2-resource";

const resource = Mf2Resource.fromFile("en", "locales/en.src");
const greeting = resource.getEntry("greeting");

console.log(greeting.value); // Hello {$name}, how are you?
```

```ts
/**
 * Using the Bundle to load and switch between multiple locales.
 *
 *      index.ts
 *      /locales
 *          en.src
 *          no.src
 *          fr.src
 */

import { Bundle, Mf2Resource } from "mf2-resource";

const bundle = new Bundle("en", ...Mf2Resource.loadMany("./locales"));

const greeting = bundle.getEntry("greeting");
console.log(greeting.value); // Hello {$name}, how are you?

bundle.setLocale("no");

greeting = bundle.getEntry("greeting");
console.log(greeting.value); // Hei {$name}, hvordan går det?
```

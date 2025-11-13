import { Bundle, Mf2Resource } from "./api.js";

const resource = Mf2Resource.fromFile("test.src", "en-us");

console.log(JSON.stringify(resource.parts(), null, 2));

// TODO:

// const bundle = new Bundle("en-us", resource /* ...*/);

// let greeting = bundle.getEntry("greeting");
// console.log(greeting); // Hello {$name}, how are you?

// bundle.setLocale("no");

// greeting = bundle.getEntry("greeting");
// console.log(greeting); // Hei {$name}, hvordan går det?

// https://github.com/eemeli/message-resource-wg

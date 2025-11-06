import { Bundle, Mf2Resource } from "./api.js";

const resource = Mf2Resource.fromFile("test.src", "en-us");

console.log(resource.parts());

// TODO:

const bundle = new Bundle("en-us", resource);
const greeting = bundle.getEntry("greeting");

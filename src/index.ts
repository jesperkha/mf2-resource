import { Bundle, Mf2Resource } from "./bundle.js";

const bundle = new Bundle(
    "en",
    Mf2Resource.fromFile("locales/us.src", "en"),
    Mf2Resource.fromFile("locales/no.src", "no")
);

console.log("Supported locales: " + bundle.getLocales());

let greeting = bundle.getEntry("greeting");
console.log(greeting);

bundle.setLocale("no");

greeting = bundle.getEntry("greeting");
console.log(greeting);

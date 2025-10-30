import { parseCST } from "./resource/parser.js";

// load from file

// bundle

// parse to string
import { readFileSync } from "fs";

// Synchronous read
const data: string = readFileSync("test.src", "utf-8");

console.log(
    parseCST(data, (range, msg) => {
        console.log("error: " + msg);
    })
);

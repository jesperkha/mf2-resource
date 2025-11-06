import { parse } from "./parser.js";
import { readFileSync } from "fs";

const data: string = readFileSync("test2.src", "utf-8");

// const ast = parseCST(data, (range, msg) => {
//     console.log("error: " + msg);
// });

// for (const node of ast) {
//     if (node.type == "entry") {
//         const key = node.id.value;
//         const value = node.value.value;

//         console.log(`key=${key}, value=${value}`);
//     }
// }

// console.log(JSON.stringify(ast, null, 1));

const ast = parse(data);
console.log(JSON.stringify(ast, null, 2));

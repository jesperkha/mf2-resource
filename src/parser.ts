import type { Metadata, Resource, Section } from "./resource.js";

export function parse(input: string): Resource {
    const tokens = new TokenSet(tokenizeResource(input));

    const meta = [];
    let comment = "";

    while (!tokens.eof() && tokens.cur() !== "---") {
        switch (tokens.cur()) {
            // Resource level comment
            case "#":
                const str = parseComment(tokens);
                comment += str + (comment.length === 0 ? "" : " \n");
                break;

            // Resource level metadata
            case "@":
                meta.push(parseMetadata(tokens));
                break;

            default:
                tokens.skip();
        }
    }

    return {
        comment,
        meta,
        sections,
    };
}

function parseComment(tokens: TokenSet): string {
    tokens.skip(); // #

    while (!tokens.eof() && tokens.cur() !== "?NEWLINE?") {
        tokens.next();
    }

    const str = tokens.pop().join(" ");
    return str;
}

function parseMetadata(tokens: TokenSet): Metadata {
    tokens.skip(); // @
    const key = tokens.skip().join("");
    const value = tokens.skip().join("");
    return { key, value };
}

class TokenSet {
    private tokens: string[];
    private consumed: string[];
    private i: number;

    constructor(tokens: string[]) {
        this.tokens = tokens;
        this.i = 0;
        this.consumed = [];
    }

    skip(): string[] {
        this.next();
        return this.pop();
    }

    cur(): string {
        return this.tokens[this.i]!;
    }

    eof(): boolean {
        return this.i >= this.tokens.length;
    }

    next() {
        if (!this.eof()) {
            this.consumed.push(this.tokens[this.i]!);
            this.i++;
        }
    }

    pop(): string[] {
        const toks = this.consumed;
        this.consumed = [];
        return toks;
    }
}

function tokenizeResource(input: string): string[] {
    // Normalize CRLF
    const text = input.replace(/\r\n/g, "\n");

    // Regex alternation captures all token types
    const tokenRegex = /---|[@#\[\]=\\]|[A-Za-z0-9_\-\.]+|[^\s@#\[\]=\\]+|\n/g;

    const rawTokens = [...text.matchAll(tokenRegex)].map((m) => m[0]);

    const tokens: string[] = [];

    let i = 0;
    while (i < rawTokens.length) {
        const t = rawTokens[i]!;

        // Always include newlines
        if (t === "\n") {
            tokens.push("?NEWLINE?");
            i++;
            continue;
        }

        // Skip standalone whitespace
        if (/^\s+$/.test(t)) {
            i++;
            continue;
        }

        // Accumulate multiline value continuations
        if (t === "=") {
            tokens.push("=");
            i++;
            // collect value and indented continuations
            let valueParts: string[] = [];
            while (i < rawTokens.length) {
                const next = rawTokens[i]!;
                if (next === "\n") break;
                valueParts.push(next);
                i++;
            }
            if (valueParts.length) {
                tokens.push(...valueParts);
            }
            continue;
        }

        tokens.push(t);
        i++;
    }

    return tokens;
}

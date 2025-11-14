import type { Entry, Metadata, Resource, Section } from "./resource";

export function parse(input: string): Resource {
    const tokens = new TokenSet(tokenizeInput(input));
    const cm = parseCommentAndMetadata(tokens);
    let sections: Section[] = [];

    if (tokens.cur() === "---") {
        tokens.consume();
        sections = parseSections(tokens);
    }

    return {
        comment: cm.comment,
        meta: cm.meta,
        sections,
    };
}

function parseSections(tokens: TokenSet): Section[] {
    let id: string[] = []; // Default to empty list for top level section

    const sections = [];
    let entries: Entry[] = [];

    let section: Section = {
        id: [],
        comment: "",
        meta: [],
        entries: [],
    };

    while (!tokens.eof()) {
        const cm = parseCommentAndMetadata(tokens);

        if (tokens.cur() === "[") {
            section.entries = entries;
            entries = [];
            sections.push(section);

            tokens.consume(); // [
            id = tokens.consume().split(".");
            tokens.consume(); // ]

            section = {
                id,
                comment: cm.comment,
                meta: cm.meta,
                entries: [],
            };
        } else {
            const key = tokens.consume();
            tokens.skipWhitespace();
            tokens.consume(); // =
            tokens.skipWhitespace();
            let value = tokens.consumeUntilNewline();
            tokens.next();

            while (tokens.cur() === "?SPACE?" || tokens.cur() === "?TAB?") {
                tokens.skipWhitespace();
                value += "\n";
                if (tokens.cur() === "\\") {
                    tokens.next();
                    tokens.pop();
                    while (!tokens.eof()) {
                        if (tokens.cur() === "?TAB?") value += "\t";
                        else if (tokens.cur() === "?SPACE?") value += " ";
                        else break;
                        tokens.next();
                    }
                }
                value += tokens.consumeUntilNewline();
                tokens.next();
            }

            entries.push({
                type: "entry",
                comment: cm.comment,
                meta: cm.meta,
                id: key.split("."),
                value,
            });
        }
    }

    section.entries = entries;
    entries = [];
    sections.push(section);
    return sections;
}

type CommentAndMeta = {
    comment: string;
    meta: Metadata[];
};

function parseCommentAndMetadata(tokens: TokenSet): CommentAndMeta {
    const meta = [];
    let comment = "";

    tokens.skipWhitespace();

    while (!tokens.eof()) {
        switch (tokens.cur()) {
            case "#":
                const str = parseComment(tokens);
                comment += str + (comment.length === 0 ? "" : " \n");
                break;

            case "@":
                meta.push(parseMetadata(tokens));
                break;

            case "?NEWLINE?":
                tokens.consume();
                break;

            default:
                return { comment, meta };
        }
    }

    return { comment, meta };
}

function parseComment(tokens: TokenSet): string {
    tokens.consume(); // #
    return tokens.consumeUntilNewline();
}

function parseMetadata(tokens: TokenSet): Metadata {
    tokens.consume(); // @
    const key = tokens.consume();
    tokens.skipWhitespace();
    const value = tokens.consumeUntilNewline();
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

    skipWhitespace() {
        while (!this.eof() && this.isWhitespace()) this.consume();
    }

    isWhitespace(): boolean {
        return this.isNewline() || this.cur() === "?SPACE?";
    }

    isNewline(): boolean {
        return this.cur() === "?NEWLINE?";
    }

    consume(): string {
        const cur = this.cur();
        this.next();
        this.pop();
        return cur;
    }

    consumeUntilNewline(): string {
        while (!this.eof() && !this.isNewline()) {
            this.next();
        }

        return this.pop()
            .join("")
            .replaceAll("?SPACE?", " ")
            .replaceAll("?NEWLINE?", "\n");
    }

    cur(): string {
        if (!this.eof()) return this.tokens[this.i]!;
        return "";
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

function tokenizeInput(input: string): string[] {
    const text = input.replace(/\r\n/g, "\n");
    const tokenRegex =
        /---|[@#\[\]=\\]|[\p{L}\p{N}_\-.]+|[ \t]+|[^\s@#\[\]=\\]+|\n/gu;
    const rawTokens = [...text.matchAll(tokenRegex)].map((m) => m[0]);
    const tokens: string[] = [];

    for (let i = 0; i < rawTokens.length; i++) {
        const t = rawTokens[i]!;
        if (t === "\n") {
            tokens.push("?NEWLINE?");
        } else if (t === " ") {
            tokens.push("?SPACE?");
        } else if (t === "\t") {
            tokens.push("?TAB?");
        } else if (/^[ \t]+$/.test(t)) {
            // Handle sequences of spaces/tabs
            for (const ch of t) {
                if (ch === " ") tokens.push("?SPACE?");
                else if (ch === "\t") tokens.push("?TAB?");
            }
        } else {
            tokens.push(t);
        }
    }

    return tokens;
}


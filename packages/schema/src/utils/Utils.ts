import * as ejs from "ejs";
import * as fs from "fs";
import * as path from "path";

export function isArray(value: any): boolean {
    return Object.prototype.toString.apply(value) === "[object Array]";
}

export function isNullOrUndef(value: any): boolean {
    return value === null || value === undefined || value === "undefined";
}

export function wrapInArray<T>(obj: any): T[] {
    return isArray(obj) ? obj : isNullOrUndef(obj) ? [] : [obj];
}

export function ucFirst(value: string): string {
    return value.charAt(0).toUpperCase() + value.slice(1);
}

export function camelCase(value: string): string {
    return value
        .replace(/\_/gim, " ")
        .split(" ")
        .map(itm => {
            return ucFirst(itm);
        })
        .join("");
}

export function log(message: string) {
    if (process.env.DEBUG) {
        console.log(message);
    }
}

export function renderTemplate(name: string, data?: any): string {
    const file = path.join(__dirname, "..", "..", "templates", name.replace(/\//gim, path.sep));
    const templates = fs.readFileSync(file).toString();
    ejs.clearCache();
    return ejs.render(templates, data || {});
}

export function tabsToSpaces(text: string): string {
    return text
        .split("\n")
        .map(line => {
            return line.replace(/\t/gim, "    ").trimRight();
        })
        .join("\n");
}

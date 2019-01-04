/**
 * Check if the given value is an Array.
 *
 * @export
 * @param {*} value
 * @returns {boolean}
 */
export function isArray(value: any): boolean {
    return Object.prototype.toString.apply(value) === "[object Array]";
}

/**
 * Check if the given value is null or undefined.
 *
 * @export
 * @param {*} value
 * @returns {boolean}
 */
export function isNullOrUndef(value: any): boolean {
    return value === null || value === undefined || value === "undefined";
}

/**
 * Wraps the given object in a n array
 *
 * @export
 * @template T
 * @param {*} obj
 * @returns {T[]}
 */
export function wrapInArray<T>(obj: any): T[] {
    return isArray(obj) ? obj : isNullOrUndef(obj) ? [] : [obj];
}

/**
 * Provides an async for-each for a given array.
 *
 * @export
 * @template T
 * @param {T[]} array
 * @param {(item: T, index: number, array: T[]) => void} callback
 */
export async function asyncForEach<T extends any>(array: T[], callback: (item: T, index: number, array: T[]) => void) {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
    }
}

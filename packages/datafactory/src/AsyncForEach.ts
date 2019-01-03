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

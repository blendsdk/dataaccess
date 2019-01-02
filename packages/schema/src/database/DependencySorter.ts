import { Table } from "./Table";

/**
 * A simple dependency sorter to prioritize table creation.
 *
 * @export
 * @class DependencySorter
 */
export class DependencySorter {
    protected tables: Table[];

    public constructor(tables: Table[]) {
        const me = this;
        me.tables = [];
        tables.forEach(item => {
            me.tables.push(item);
        });
    }

    public sort(): Table[] {
        const me = this;
        let sorted: string[] = [],
            unsorted: Table[] = [],
            done: boolean = false;
        this.tables.forEach(item => unsorted.push(item));

        while (!done) {
            done = true;
            // tslint:disable-next-line:no-debugger
            unsorted.forEach(item => {
                item.getForeignKeys().forEach(fKey => {
                    if (sorted.indexOf(fKey.getRefTable().getName()) === -1) {
                        sorted.push(fKey.getRefTable().getName());
                        done = false;
                    }
                });
                if (sorted.indexOf(item.getName()) === -1) {
                    sorted.push(item.getName());
                }
            });
            unsorted = [];
            sorted.forEach(name => {
                unsorted.push(this.tables[me.findIndexOf(name, this.tables)]);
            });
            sorted = [];
        }
        return unsorted;
    }

    /**
     * Find the index of a table in the tables array given
     * its name.
     *
     * @protected
     * @param {string} name
     * @param {Table[]} tables
     * @returns
     * @memberof DependencySorter
     */
    protected findIndexOf(name: string, tables: Table[]) {
        let result: number = -1;
        tables.forEach((table: Table, index: number) => {
            if (result === -1 && table.getName() === name) {
                result = index;
            }
        });
        return result;
    }
}

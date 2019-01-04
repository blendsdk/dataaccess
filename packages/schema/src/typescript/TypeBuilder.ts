import * as fs from "fs";
import * as path from "path";
import { Table } from "../database/Table";
import * as utils from "../utils/Utils";
import { mapColumnType } from "./Utils";

/**
 * This class creates interface types for provided tables.
 * in the DbTypes.ts file.
 *
 * @export
 * @class TypeBuilder
 */
export class TypeBuilder {
    /**
     * List of tables to generate interface types for.
     *
     * @protected
     * @type {Table[]}
     * @memberof TypeBuilder
     */
    protected tables: Table[];

    /**
     * Creates an instance of TypeBuilder.
     * @param {(Table | Table[])} table
     * @memberof TypeBuilder
     */
    public constructor(table: Table | Table[]) {
        this.tables = utils.wrapInArray(table);
    }

    /**
     * Generates the interfaces.
     *
     * @protected
     * @param {Table} table
     * @returns
     * @memberof TypeBuilder
     */
    protected generateInterface(table: Table) {
        return utils.renderTemplate("typescript/interface.ejs", {
            name: `I${utils.camelCase(table.getName())}`,
            columns: table.getColumns(),
            tableName: table.getName(),
            mapType: mapColumnType
        });
    }

    /**
     * Kickstart the type generation.
     *
     * @param {string} outFolder
     * @memberof TypeBuilder
     */
    public generate(outFolder: string) {
        const result: string[] = [];
        this.tables.forEach(table => {
            result.push(this.generateInterface(table).trim());
        });
        fs.writeFileSync(path.join(outFolder, "DbTypes.ts"), utils.tabsToSpaces(result.join("\n\n")));
    }
}

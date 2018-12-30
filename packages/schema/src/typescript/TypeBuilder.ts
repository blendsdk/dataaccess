import * as fs from "fs";
import * as path from "path";
import { Table } from "../database/Table";
import * as utils from "../utils/Utils";
import { mapColumnType } from "./Utils";

export class TypeBuilder {
    protected tables: Table[];

    public constructor(table: Table | Table[]) {
        this.tables = utils.wrapInArray(table);
    }

    protected generateInterface(table: Table) {
        return utils.renderTemplate("typescript/interface.ejs", {
            name: `I${utils.camelCase(table.getName())}`,
            columns: table.getColumns(),
            tableName: table.getName(),
            mapType: mapColumnType
        });
    }

    public generate(outFolder: string) {
        const result: string[] = [];
        this.tables.forEach(table => {
            result.push(this.generateInterface(table).trim());
        });
        fs.writeFileSync(path.join(outFolder, "DbTypes.ts"), utils.tabsToSpaces(result.join("\n\n")));
    }
}

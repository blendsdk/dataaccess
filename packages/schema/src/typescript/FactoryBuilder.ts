import * as fs from "fs";
import * as mkdirp from "mkdirp";
import * as path from "path";
import { Table } from "../database/Table";
import * as utils from "../utils/Utils";
import { mapColumnType } from "./Utils";

export class FactoryBuilder {
    protected tables: Table[];
    protected baseFolder: string;
    protected outFolder: string;

    public constructor(table: Table | Table[]) {
        this.tables = utils.wrapInArray(table);
    }

    protected getInterfaceName(table: Table): string {
        return `I${utils.camelCase(table.getName())}`;
    }

    protected generateInsert(table: Table): string {
        const me = this;
        return utils.renderTemplate("typescript/factory_insert.ejs", {
            interfaceName: me.getInterfaceName(table),
            tableName: table.getName()
        });
    }

    // protected generateFactory(table: Table) {
    //     return utils.renderTemplate("typescript/factory.ejs", {
    //         factoryName: `${utils.camelCase(table.getName())}Factory`,
    //         recordName: `I${utils.camelCase(table.getName())}`,
    //         tableName: table.getName(),
    //         columns: table.getColumns(),
    //         mapType: mapColumnType,
    //         ...this.options
    //     });
    // }

    protected generatePublicClass(table: Table) {
        const me = this,
            className = `${utils.camelCase(table.getName())}Factory`,
            clazz = utils.renderTemplate("typescript/factory_public.ejs", {
                className,
                tableName: table.getName(),
                interfaceName: me.getInterfaceName(table)
            });
        utils.log(`Generating ${className}`);
        fs.writeFileSync(path.join(this.outFolder, `${className}.ts`), utils.tabsToSpaces(clazz));
    }

    protected generateBaseClass(table: Table) {
        const methods: string[] = [];
        if (table.hasPrimaryKey()) {
            methods.push(this.generateInsert(table));
        }
        const me = this,
            className = `${utils.camelCase(table.getName())}FactoryBase`,
            clazz = utils.renderTemplate("typescript/factory_base.ejs", {
                className,
                tableName: table.getName(),
                interfaceName: me.getInterfaceName(table),
                methods
            });
        utils.log(`Generating ${className}`);
        fs.writeFileSync(path.join(this.outFolder, "base", `${className}.ts`), utils.tabsToSpaces(clazz));
    }

    protected generateFactory(table: Table) {
        const me = this;
        me.generatePublicClass(table);
        me.generateBaseClass(table);
    }

    public generate(outFolder: string) {
        const me = this,
            result: string[] = [];

        this.outFolder = outFolder;
        this.baseFolder = path.join(this.outFolder, "base");
        mkdirp.sync(this.baseFolder);

        this.tables.forEach(table => {
            me.generateFactory(table);
        });
    }
}

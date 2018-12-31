import * as fs from "fs";
import * as mkdirp from "mkdirp";
import * as path from "path";
import { Column } from "../database/Column";
import { Table } from "../database/Table";
import { eDBConstraintType } from "../database/Types";
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

    protected generateInsert(table: Table, methods: string[]) {
        const me = this;
        methods.push(
            utils.renderTemplate("typescript/factory_insert.ejs", {
                interfaceName: me.getInterfaceName(table),
                tableName: table.getName()
            })
        );
    }

    protected camelCaseColumnNames(names: string[]): string[] {
        return names.map(name => {
            if (name.toLowerCase() === "id") {
                return "ID";
            } else {
                return utils.camelCase(name);
            }
        });
    }

    protected columnToMethodParameters(columns: Column[]): string[] {
        return columns.map(column => {
            return `${column.getName()}: ${mapColumnType(column.getType())}`;
        });
    }

    protected generateConstraintMethodsBy(table: Table, methods: string[]) {
        const me = this,
            constraints = table.getConstraints().filter(item => {
                switch (item.getType()) {
                    case eDBConstraintType.primaryKey:
                    case eDBConstraintType.unique:
                        return true;
                    default:
                        return false;
                }
            });
        if (constraints.length !== 0) {
            constraints.forEach(constraint => {
                methods.push(
                    utils.renderTemplate("typescript/factory_constraint_methods.ejs", {
                        methodName: me.camelCaseColumnNames(constraint.getColumnNames()).join("And"),
                        parameters: me.columnToMethodParameters(constraint.getColumns()),
                        parameterValues: constraint.getColumnNames(),
                        interfaceName: me.getInterfaceName(table),
                        tableName: table.getName(),
                        columns: me.camelCaseColumnNames(constraint.getColumnNames())
                    })
                );
            });
        }
    }

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
        const me = this,
            methods: string[] = [];
        if (table.hasPrimaryKey()) {
            me.generateInsert(table, methods);
        }

        me.generateConstraintMethodsBy(table, methods);

        const className = `${utils.camelCase(table.getName())}FactoryBase`,
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

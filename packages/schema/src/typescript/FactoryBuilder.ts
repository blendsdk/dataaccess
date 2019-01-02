import * as fs from "fs";
import * as mkdirp from "mkdirp";
import * as path from "path";
import { Column } from "../database/Column";
import { Table } from "../database/Table";
import { eDBConstraintType } from "../database/Types";
import * as utils from "../utils/Utils";
import { mapColumnType } from "./Utils";

/**
 * This class generates data factory classes
 * based on the provided tables.
 *
 * @export
 * @class FactoryBuilder
 */
export class FactoryBuilder {
    /**
     * Internal list of tables
     *
     * @protected
     * @type {Table[]}
     * @memberof FactoryBuilder
     */
    protected tables: Table[];

    /**
     * The base folder to generate the files
     *
     * @protected
     * @type {string}
     * @memberof FactoryBuilder
     */
    protected baseFolder: string;

    /**
     * The parent folder of the base folder.
     *
     * @protected
     * @type {string}
     * @memberof FactoryBuilder
     */
    protected outFolder: string;

    /**
     * Class constructor
     * @param {(Table | Table[])} table
     * @memberof FactoryBuilder
     */
    public constructor(table: Table | Table[]) {
        this.tables = utils.wrapInArray(table);
    }

    /**
     * Generates an interface name
     *
     * @protected
     * @param {Table} table
     * @returns {string}
     * @memberof FactoryBuilder
     */
    protected getInterfaceName(table: Table): string {
        return `I${utils.camelCase(table.getName())}`;
    }

    /**
     * Generates the insert method.
     *
     * @protected
     * @param {Table} table
     * @param {string[]} methods
     * @memberof FactoryBuilder
     */
    protected generateInsert(table: Table, methods: string[]) {
        const me = this;
        methods.push(
            utils.renderTemplate("typescript/factory_insert.ejs", {
                interfaceName: me.getInterfaceName(table),
                tableName: table.getName()
            })
        );
    }

    /**
     * Makes the column names camel case
     *
     * @protected
     * @param {string[]} names
     * @returns {string[]}
     * @memberof FactoryBuilder
     */
    protected camelCaseColumnNames(names: string[]): string[] {
        return names.map(name => {
            if (name.toLowerCase() === "id") {
                return "ID";
            } else {
                return utils.camelCase(name);
            }
        });
    }

    /**
     * Based on a column array, this method generates ts method
     * parameters.
     *
     * @protected
     * @param {Column[]} columns
     * @returns {string[]}
     * @memberof FactoryBuilder
     */
    protected columnToMethodParameters(columns: Column[]): string[] {
        return columns.map(column => {
            return `${column.getName()}: ${mapColumnType(column.getType())}`;
        });
    }

    /**
     * Generates the constraint methods.
     *
     * @protected
     * @param {Table} table
     * @param {string[]} methods
     * @memberof FactoryBuilder
     */
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

    /**
     * Generates the public part of the factory class
     *
     * @protected
     * @param {Table} table
     * @memberof FactoryBuilder
     */
    protected generatePublicClass(table: Table) {
        const me = this,
            className = `${utils.camelCase(table.getName())}Factory`,
            fileName = path.join(this.outFolder, `${className}.ts`);

        if (!fs.existsSync(fileName)) {
            const clazz = utils.renderTemplate("typescript/factory_public.ejs", {
                className,
                tableName: table.getName(),
                interfaceName: me.getInterfaceName(table)
            });
            utils.log(`Generating ${className}`);
            fs.writeFileSync(path.join(this.outFolder, `${className}.ts`), utils.tabsToSpaces(clazz));
        } else {
            utils.log(`\tSkipping ${className}`);
        }
    }

    /**
     * Generates the base part of the factory class.
     *
     * @protected
     * @param {Table} table
     * @memberof FactoryBuilder
     */
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

    /**
     * Generates the factory
     *
     * @protected
     * @param {Table} table
     * @memberof FactoryBuilder
     */
    protected generateFactory(table: Table) {
        const me = this;
        me.generatePublicClass(table);
        me.generateBaseClass(table);
    }

    /**
     * Kickstarts the factory generation.
     *
     * @param {string} outFolder
     * @memberof FactoryBuilder
     */
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

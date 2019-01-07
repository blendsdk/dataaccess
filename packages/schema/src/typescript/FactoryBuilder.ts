import * as fs from "fs";
import * as mkdirp from "mkdirp";
import * as path from "path";
import { Column } from "../database/Column";
import { Table } from "../database/Table";
import { eDBConstraintType } from "../database/Types";
import * as utils from "../utils/Utils";
import { mapColumnType } from "./Utils";

/**
 * Enum to configure a query method.
 *
 * @export
 * @enum {string}
 */
export enum eQueryMethod {
    executeNonQuery = "executeNonQuery",
    executeQuery = "executeQuery",
    executeQuerySingle = "executeQuerySingle"
}

/**
 * Interface for describing a parameter for IMethod interface
 *
 * @export
 * @interface IMethodParameter
 */
export interface IMethodParameter {
    name: string;
    type: string;
}

/**
 * Interface for describing a method for the FactoryBuilder addMethod.
 *
 * @export
 * @interface IMethod
 */
export interface IMethod {
    forTable: Table;
    description?: string;
    methodName: string;
    returnType?: string;
    returnTypeIsArray?: boolean;
    parameters?: IMethodParameter | IMethodParameter[];
    queryMethod: eQueryMethod;
    query: string;
}

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
     * List of factory classes
     *
     * @protected
     * @type {string[]}
     * @memberof FactoryBuilder
     */
    protected factoryClasses: string[];
    /**
     * List of methods to be added to a factory class.
     *
     * @protected
     * @type {IMethod[]}
     * @memberof FactoryBuilder
     */
    protected factoryMethods: IMethod[];
    /**
     * List of db type interfaces to be imported to the factory base class.
     *
     * @protected
     * @type {string[]}
     * @memberof FactoryBuilder
     */
    protected importedDbTypes: string[];

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
     * Creates an instance of FactoryBuilder.
     * @memberof FactoryBuilder
     */
    public constructor() {
        this.factoryClasses = ["DbTypes"];
        this.factoryMethods = [];
        this.importedDbTypes = [];
    }

    /**
     * Adds a method description to be generated for a given table
     *
     * @param {(IMethod | IMethod[])} method
     * @memberof FactoryBuilder
     */
    public addMethod(method: IMethod | IMethod[]) {
        const me = this;
        utils.wrapInArray<IMethod>(method).forEach(item => {
            me.factoryMethods.push(item);
        });
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
        const me = this;
        table.getConstraints().forEach(constraint => {
            const singleOperation =
                constraint.getType() === eDBConstraintType.primaryKey ||
                constraint.getType() === eDBConstraintType.unique;
            methods.push(
                utils.renderTemplate("typescript/factory_constraint_methods.ejs", {
                    methodName: me.camelCaseColumnNames(constraint.getColumnNames()).join("And"),
                    parameters: me.columnToMethodParameters(constraint.getColumns()),
                    parameterValues: constraint.getColumnNames(),
                    interfaceName: me.getInterfaceName(table),
                    tableName: table.getName(),
                    columns: me.camelCaseColumnNames(constraint.getColumnNames()),
                    returnType: `${me.getInterfaceName(table)}${singleOperation ? "" : "[]"}`,
                    singleOpr: singleOperation
                })
            );
        });
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

        this.factoryClasses.push(className);

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

        utils.log("Generating the factory index");
        fs.writeFileSync(
            path.join(this.outFolder, "index.ts"),
            this.factoryClasses.map(item => `export * from "./${item}";`).join("\n")
        );
    }

    /**
     * Generate factory methods.
     *
     * @protected
     * @param {Table} table
     * @param {string[]} methods
     * @memberof FactoryBuilder
     */
    protected generateFactoryMethods(table: Table, methods: string[]) {
        const me = this,
            methodDefs = me.factoryMethods.filter(def => {
                return def.forTable.getName() === table.getName();
            });

        methodDefs.forEach(methodDef => {
            const returnType = (methodDef.returnType || me.getInterfaceName(table)).trim();
            if (me.importedDbTypes.indexOf(returnType) === -1) {
                me.importedDbTypes.push(returnType);
                console.log(me.importedDbTypes.join(" | "));
            }
            methods.push(
                utils.renderTemplate("typescript/factory_method.ejs", {
                    returnType: `${returnType}${methodDef.returnTypeIsArray ? "[]" : ""}`.trim(),
                    methodName: methodDef.methodName,
                    methodParameters: utils
                        .wrapInArray<IMethodParameter>(methodDef.parameters)
                        .map(param => {
                            return `${param.name}: ${param.type}`;
                        })
                        .join(", "),
                    queryMethod: methodDef.queryMethod,
                    query: methodDef.query,
                    queryParameters: utils
                        .wrapInArray<IMethodParameter>(methodDef.parameters)
                        .map(param => {
                            return `${param.name}`;
                        })
                        .join(", "),
                    jsDocs: [methodDef.description || `The ${methodDef.methodName} method.`].concat(
                        utils
                            .wrapInArray<IMethodParameter>(methodDef.parameters)
                            .map(param => {
                                return `@param {${param.type}} ${param.name}`;
                            })
                            .concat([
                                `@returns {Promise<${returnType}>}`,
                                `@memberof ${utils.camelCase(table.getName())}FactoryBase`
                            ])
                    )
                })
            );
        });
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

        me.importedDbTypes = [me.getInterfaceName(table)];

        me.addMethod({
            forTable: table,
            description: `Gets all records of ${table.getName()}`,
            query: `SELECT * FROM ${table.getName()}`,
            queryMethod: eQueryMethod.executeQuery,
            methodName: "getAll",
            returnTypeIsArray: true
        });

        me.generateInsert(table, methods);
        me.generateConstraintMethodsBy(table, methods);
        me.generateFactoryMethods(table, methods);

        me.importedDbTypes.sort();

        const className = `${utils.camelCase(table.getName())}FactoryBase`,
            clazz = utils.renderTemplate("typescript/factory_base.ejs", {
                className,
                tableName: table.getName(),
                interfaceNames: me.importedDbTypes.join(", "),
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
    public generate(tables: Table[], outFolder: string) {
        const me = this,
            result: string[] = [];
        this.tables = utils.wrapInArray(tables);
        this.outFolder = outFolder;
        this.baseFolder = path.join(this.outFolder, "base");
        mkdirp.sync(this.baseFolder);

        this.tables.forEach(table => {
            me.generateFactory(table);
        });
    }
}

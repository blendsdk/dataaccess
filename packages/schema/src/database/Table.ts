import { Base } from "./Base";
import { Column } from "./Column";
import { Constraint } from "./Constraint";
import { ForeignKeyConstraint } from "./ForeignKeyConstraint";
import { eDBColumnType, eDBConstraintType, IColumnOptions, IForeignKeyAction } from "./Types";

/**
 * This class represents a database Table
 *
 * @export
 * @class Table
 * @extends {Base}
 */
export class Table extends Base {
    protected columns: Column[];
    protected constraints: Constraint[];

    /**
     * Creates an instance of Table.
     * @param {string} name
     * @memberof Table
     */
    public constructor(name: string) {
        super(name);
        this.columns = [];
        this.constraints = [];
    }

    /**
     * Get the columns of this table.
     *
     * @returns
     * @memberof Table
     */
    public getColumns() {
        return this.columns;
    }

    /**
     * Indicates if we have a primary key.
     *
     * @returns {boolean}
     * @memberof Table
     */
    public hasPrimaryKey(): boolean {
        return this.getPrimaryKey() !== null;
    }

    /**
     * Get the primary key of this table.
     *
     * @returns
     * @memberof Table
     */
    public getPrimaryKey() {
        const result = this.constraints.filter(item => {
            return item.getType() === eDBConstraintType.primaryKey;
        });
        return result.length !== 0 ? result[0] : null;
    }

    /**
     * Indicates if we have foreign keys.
     *
     * @returns {boolean}
     * @memberof Table
     */
    public hasForeignKeys(): boolean {
        return this.getForeignKeys().length !== 0;
    }

    /**
     * Gets the foreign keys of this tbale.
     *
     * @returns {ForeignKeyConstraint[]}
     * @memberof Table
     */
    public getForeignKeys(): ForeignKeyConstraint[] {
        const result: ForeignKeyConstraint[] = this.constraints.filter(item => {
            return item.getType() === eDBConstraintType.foreignKey;
        }) as ForeignKeyConstraint[];
        return result || [];
    }

    /**
     * Gets the constraints of this table.
     *
     * @template T
     * @param {eDBConstraintType} [type]
     * @returns {T[]}
     * @memberof Table
     */
    public getConstraints<T extends Constraint>(type?: eDBConstraintType): T[] {
        if (type) {
            return (this.constraints.filter(item => {
                return item.getType() === type;
            }) || []) as T[];
        } else {
            return this.constraints as T[];
        }
    }

    /**
     * Adds a column to this table.
     *
     * @protected
     * @param {Column} column
     * @returns {Column}
     * @memberof Table
     */
    protected addColumn(column: Column): Column {
        if (column.isUnique()) {
            const unique = new Constraint(`unique_${column.getName()}`, eDBConstraintType.unique);
            unique.addColumn(column);
            this.constraints.push(unique);
        }
        this.columns.push(column);
        return column;
    }

    /**
     * Adds a referenced column to this table.
     *
     * @param {string} name
     * @param {Table} refTable
     * @param {string} [refColumn]
     * @param {IForeignKeyAction} [refOptions]
     * @param {IColumnOptions} [options]
     * @returns {this}
     * @memberof Table
     */
    public referenceColumn(
        name: string,
        refTable: Table,
        refColumn?: string,
        refOptions?: IForeignKeyAction,
        options?: IColumnOptions
    ): this {
        refColumn = refColumn || "id";
        const column = this.addColumn(new Column(name, eDBColumnType.number, options)),
            fKey = new ForeignKeyConstraint(`fkey_${column.getName()}`, refTable, refColumn, refOptions);
        fKey.addColumn(column);
        this.constraints.push(fKey);
        return this;
    }

    /**
     * Adds an auto incremented primary key to this table.
     *
     * @param {string} [name]
     * @returns {this}
     * @memberof Table
     */
    public primaryKeyColumn(name?: string): this {
        name = name || "id";
        const column = this.addColumn(new Column(name, eDBColumnType.autoIncrement));
        let pKey = this.getPrimaryKey();
        if (!pKey) {
            pKey = new Constraint("pkey", eDBConstraintType.primaryKey);
            this.constraints.push(pKey);
        }
        pKey.addColumn(column);
        return this;
    }

    /**
     * Adds a decimal column to this table.
     *
     * @param {string} name
     * @param {IColumnOptions} [options]
     * @returns {this}
     * @memberof Table
     */
    public decimalColumn(name: string, options?: IColumnOptions): this {
        this.addColumn(new Column(name, eDBColumnType.decimal, options));
        return this;
    }

    /**
     * Adds a guid column to this table
     *
     * @param {string} name
     * @param {IColumnOptions} [options]
     * @returns {this}
     * @memberof Table
     */
    public guidColumn(name: string, options?: IColumnOptions): this {
        this.addColumn(new Column(name, eDBColumnType.guid, options));
        return this;
    }

    /**
     * Adds a date-time column to this table.
     *
     * @param {string} name
     * @param {IColumnOptions} [options]
     * @returns {this}
     * @memberof Table
     */
    public dateTimeColumn(name: string, options?: IColumnOptions): this {
        this.addColumn(new Column(name, eDBColumnType.dateTime, options));
        return this;
    }

    /**
     * Adds a boolean column to this table.
     *
     * @param {string} name
     * @param {IColumnOptions} [options]
     * @returns {this}
     * @memberof Table
     */
    public booleanColumn(name: string, options?: IColumnOptions): this {
        this.addColumn(new Column(name, eDBColumnType.boolean, options));
        return this;
    }

    /**
     * Adds a string column to this table.
     *
     * @param {string} name
     * @param {IColumnOptions} [options]
     * @returns {this}
     * @memberof Table
     */
    public stringColumn(name: string, options?: IColumnOptions): this {
        this.addColumn(new Column(name, eDBColumnType.string, options));
        return this;
    }

    /**
     * Adds a number column to this table.
     *
     * @param {string} name
     * @param {IColumnOptions} [options]
     * @returns {this}
     * @memberof Table
     */
    public numberColumn(name: string, options?: IColumnOptions): this {
        this.addColumn(new Column(name, eDBColumnType.number, options));
        return this;
    }
}

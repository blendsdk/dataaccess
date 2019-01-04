import { wrapInArray } from "../utils/Utils";
import { Constraint } from "./Constraint";
import { Table } from "./Table";
import { eDBConstraintType, eDBForeignKeyAction, IForeignKeyAction } from "./Types";

/**
 * This class provides functionality to add a foreign key constraint to a table.
 *
 * @export
 * @class ForeignKeyConstraint
 * @extends {Constraint}
 */
export class ForeignKeyConstraint extends Constraint {
    /**
     * the constraint options.
     *
     * @protected
     * @type {IForeignKeyAction}
     * @memberof ForeignKeyConstraint
     */
    protected options: IForeignKeyAction;
    /**
     * The reference table
     *
     * @protected
     * @type {Table}
     * @memberof ForeignKeyConstraint
     */
    protected refTable: Table;
    /**
     * Referenced column names.
     *
     * @protected
     * @type {string[]}
     * @memberof ForeignKeyConstraint
     */
    protected refColumns: string[];

    /**
     * Gets the referenced table
     *
     * @returns {Table}
     * @memberof ForeignKeyConstraint
     */
    public getRefTable(): Table {
        return this.refTable;
    }

    /**
     * Gets the referenced columns.
     *
     * @returns {string[]}
     * @memberof ForeignKeyConstraint
     */
    public getRefColumns(): string[] {
        return this.refColumns;
    }

    /**
     * Gets the on update action.
     *
     * @returns {eDBForeignKeyAction}
     * @memberof ForeignKeyConstraint
     */
    public getOnUpdate(): eDBForeignKeyAction {
        return this.options.onUpdate || eDBForeignKeyAction.cascade;
    }

    /**
     * Get the on delete action.
     *
     * @returns {eDBForeignKeyAction}
     * @memberof ForeignKeyConstraint
     */
    public getOnDelete(): eDBForeignKeyAction {
        return this.options.onDelete || eDBForeignKeyAction.cascade;
    }

    /**
     * Creates an instance of ForeignKeyConstraint.
     * @param {string} name
     * @param {Table} refTable
     * @param {(string | string[])} refColumn
     * @param {IForeignKeyAction} [options]
     * @memberof ForeignKeyConstraint
     */
    public constructor(name: string, refTable: Table, refColumn: string | string[], options?: IForeignKeyAction) {
        super(name, eDBConstraintType.foreignKey, options);
        this.refTable = refTable;
        this.refColumns = wrapInArray(refColumn);
        this.options = options || {
            onDelete: eDBForeignKeyAction.cascade,
            onUpdate: eDBForeignKeyAction.cascade
        };
    }
}

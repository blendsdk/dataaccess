import { Base } from "./Base";
import { Column } from "./Column";
import { eDBConstraintType } from "./Types";

/**
 * This class models a generic constraint.
 *
 * @export
 * @class Constraint
 * @extends {Base}
 */
export class Constraint extends Base {
    /**
     * The constraint columns.
     *
     * @protected
     * @type {Column[]}
     * @memberof Constraint
     */
    protected columns: Column[];
    /**
     * The type of the constraint.
     *
     * @protected
     * @type {eDBConstraintType}
     * @memberof Constraint
     */
    protected type: eDBConstraintType;
    /**
     * The options for this constraint.
     *
     * @protected
     * @type {*}
     * @memberof Constraint
     */
    protected options: any;

    /**
     * Creates an instance of Constraint.
     * @param {string} name
     * @param {eDBConstraintType} type
     * @param {*} [options]
     * @memberof Constraint
     */
    public constructor(name: string, type: eDBConstraintType, options?: any) {
        super(name);
        this.columns = [];
        this.type = type;
        this.options = options || {};
    }

    /**
     * Get the constraint columns.
     *
     * @returns {Column[]}
     * @memberof Constraint
     */
    public getColumns(): Column[] {
        return this.columns;
    }

    /**
     * Get the column names.
     *
     * @returns {string[]}
     * @memberof Constraint
     */
    public getColumnNames(): string[] {
        return this.columns.map(column => {
            return column.getName();
        });
    }

    /**
     * The constraint type.
     *
     * @returns {eDBConstraintType}
     * @memberof Constraint
     */
    public getType(): eDBConstraintType {
        return this.type;
    }

    /**
     * Adds a column to this constraint.
     *
     * @param {Column} column
     * @returns {this}
     * @memberof Constraint
     */
    public addColumn(column: Column): this {
        this.columns.push(column);
        return this;
    }
}

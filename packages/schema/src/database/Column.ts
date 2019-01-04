import { Base } from "./Base";
import { eDBColumnType, IColumnOptions } from "./Types";

/**
 * This class provides a way to model a database table column.
 *
 * @export
 * @class Column
 * @extends {Base}
 */
export class Column extends Base {
    /**
     * The column type
     *
     * @protected
     * @type {eDBColumnType}
     * @memberof Column
     */
    protected type: eDBColumnType;

    /**
     * The column options
     *
     * @protected
     * @type {IColumnOptions}
     * @memberof Column
     */
    protected options: IColumnOptions;

    /**
     * Get if this column is required.
     *
     * @returns {boolean}
     * @memberof Column
     */
    public isRequired(): boolean {
        return this.options.required;
    }

    /**
     * Get if this column is unique.
     *
     * @returns {boolean}
     * @memberof Column
     */
    public isUnique(): boolean {
        return this.options.unique;
    }

    /**
     * Get the column type.
     *
     * @returns {eDBColumnType}
     * @memberof Column
     */
    public getType(): eDBColumnType {
        return this.type;
    }

    /**
     * Get the check constraint.
     *
     * @returns {string}
     * @memberof Column
     */
    public getCheck(): string {
        return this.options.check;
    }

    /**
     * Get the column's default value.
     *
     * @returns {string}
     * @memberof Column
     */
    public getDefault(): string {
        return this.options.default;
    }

    /**
     * Creates an instance of Column.
     * @param {string} name
     * @param {eDBColumnType} type
     * @param {IColumnOptions} [options]
     * @memberof Column
     */
    public constructor(name: string, type: eDBColumnType, options?: IColumnOptions) {
        super(name);
        this.type = type;
        options = options || {};
        this.options = {
            check: options.check || undefined,
            default: options.default || undefined,
            required: options.required === undefined ? true : options.required,
            unique: options.unique === undefined ? false : options.unique
        };
    }
}

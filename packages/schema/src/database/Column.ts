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
    protected type: eDBColumnType;
    protected options: IColumnOptions;

    public iNullable(): boolean {
        return this.options.nullable || false;
    }

    public isUnique(): boolean {
        return this.options.unique || false;
    }

    public getType(): eDBColumnType {
        return this.type;
    }

    public getCheck(): string {
        return this.options.check;
    }

    public getDefault(): string {
        return this.options.default;
    }

    public constructor(name: string, type: eDBColumnType, options?: IColumnOptions) {
        super(name);
        this.type = type;
        options = options || {};
        this.options = {
            check: options.check || undefined,
            default: options.default || undefined,
            nullable: options.nullable || false,
            unique: options.unique || false
        };
    }
}

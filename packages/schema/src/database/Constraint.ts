import { Base } from "./Base";
import { Column } from "./Column";
import { eDBConstraintType } from "./Types";

export class Constraint extends Base {
    protected columns: Column[];
    protected type: eDBConstraintType;
    protected options: any;
    public constructor(name: string, type: eDBConstraintType, options?: any) {
        super(name);
        this.columns = [];
        this.type = type;
        this.options = options || {};
    }

    public getColumns(): Column[] {
        return this.columns;
    }

    public getColumnNames(): string[] {
        return this.columns.map(column => {
            return column.getName();
        });
    }

    public getType(): eDBConstraintType {
        return this.type;
    }

    public addColumn(column: Column): this {
        this.columns.push(column);
        return this;
    }
}

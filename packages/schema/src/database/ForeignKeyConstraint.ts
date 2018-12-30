import { wrapInArray } from "../utils/Utils";
import { Constraint } from "./Constraint";
import { Table } from "./Table";
import { eDBConstraintType, eDBForeignKeyAction, IForeignKeyAction } from "./Types";

export class ForeignKeyConstraint extends Constraint {
    protected options: IForeignKeyAction;
    protected refTable: Table;
    protected refColumns: string[];

    public getRefTable(): Table {
        return this.refTable;
    }

    public getRefColumns(): string[] {
        return this.refColumns;
    }

    public getOnUpdate(): eDBForeignKeyAction {
        return this.options.onUpdate || eDBForeignKeyAction.cascade;
    }

    public getOnDelete(): eDBForeignKeyAction {
        return this.options.onDelete || eDBForeignKeyAction.cascade;
    }

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

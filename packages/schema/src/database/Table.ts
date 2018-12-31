import { Base } from "./Base";
import { Column } from "./Column";
import { Constraint } from "./Constraint";
import { ForeignKeyConstraint } from "./ForeignKeyConstraint";
import { eDBColumnType, eDBConstraintType, eDBForeignKeyAction, IColumnOptions, IForeignKeyAction } from "./Types";

export class Table extends Base {
    protected columns: Column[];
    protected constraints: Constraint[];

    public constructor(name: string) {
        super(name);
        this.columns = [];
        this.constraints = [];
    }

    public getColumns() {
        return this.columns;
    }

    public hasPrimaryKey(): boolean {
        return this.getPrimaryKey() !== null;
    }

    public getPrimaryKey() {
        const result = this.constraints.filter(item => {
            return item.getType() === eDBConstraintType.primaryKey;
        });
        return result.length !== 0 ? result[0] : null;
    }

    public getConstraints<T extends Constraint>(type?: eDBConstraintType): T[] {
        if (type) {
            return (this.constraints.filter(item => {
                return item.getType() === type;
            }) || []) as T[];
        } else {
            return this.constraints as T[];
        }
    }

    protected addColumn(column: Column): Column {
        if (column.isUnique()) {
            const unique = new Constraint(`unique_${column.getName()}`, eDBConstraintType.unique);
            unique.addColumn(column);
            this.constraints.push(unique);
        }
        this.columns.push(column);
        return column;
    }

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

    public decimalColumn(name: string, options?: IColumnOptions): this {
        this.addColumn(new Column(name, eDBColumnType.decimal, options));
        return this;
    }

    public guidColumn(name: string, options?: IColumnOptions): this {
        this.addColumn(new Column(name, eDBColumnType.guid, options));
        return this;
    }

    public dateTimeColumn(name: string, options?: IColumnOptions): this {
        this.addColumn(new Column(name, eDBColumnType.dateTime, options));
        return this;
    }

    public booleanColumn(name: string, options?: IColumnOptions): this {
        this.addColumn(new Column(name, eDBColumnType.boolean, options));
        return this;
    }

    public stringColumn(name: string, options?: IColumnOptions): this {
        this.addColumn(new Column(name, eDBColumnType.string, options));
        return this;
    }

    public numberColumn(name: string, options?: IColumnOptions): this {
        this.addColumn(new Column(name, eDBColumnType.number, options));
        return this;
    }
}

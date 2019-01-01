import { Pool, QueryResult } from "pg";
import { Database } from "../database/Database";
import { ForeignKeyConstraint } from "../database/ForeignKeyConstraint";
import { Table } from "../database/Table";
import { eDBColumnType, eDBConstraintType, eDBForeignKeyAction } from "../database/Types";
import { log } from "../utils/Utils";

const pool = new Pool();

/**
 * Executes a SQL statement and returns a QueryResult object
 *
 * @param {string} stmt
 * @param {any[]} [params]
 * @returns {Promise<QueryResult>}
 */
function executeQuery(stmt: string, params?: any[]): Promise<QueryResult> {
    log(`${stmt};`);
    return pool.query(stmt, params || []);
}

export class PostgreSQLDatabase extends Database {
    protected script: string[];

    public constructor(name: string) {
        super(name);
        this.script = [];
    }

    protected mapColumnType(type: eDBColumnType): string {
        switch (type) {
            case eDBColumnType.string:
                return "varchar";
            case eDBColumnType.number:
                return "integer";
            case eDBColumnType.guid:
                return "uuid";
            case eDBColumnType.decimal:
                return "decimal";
            case eDBColumnType.dateTime:
                return "timestamp";
            case eDBColumnType.boolean:
                return "boolean";
            case eDBColumnType.autoIncrement:
                return "serial";
            default:
                throw Error(`Undefined column type ${type}`);
        }
    }

    protected mapRefAction(type: eDBForeignKeyAction) {
        switch (type) {
            case eDBForeignKeyAction.cascade:
                return "CASCADE";
            case eDBForeignKeyAction.setNull:
                return "SET NULL";
            default:
                throw Error(`Undefined reference action type ${type}`);
        }
    }

    protected dropTable(table: Table) {
        this.script.push(`DROP TABLE IF EXISTS ${table.getName()} CASCADE`);
    }

    public createTable(table: Table) {
        this.script.push(`CREATE TABLE ${table.getName()}()`);
    }

    protected createColumns(table: Table) {
        const me = this;
        table.getColumns().forEach(column => {
            me.script.push(
                `ALTER TABLE ${table.getName()} ADD COLUMN ${column.getName()} ${this.mapColumnType(
                    column.getType()
                )} ${column.isUnique() ? "" : "NOT NULL"} ${
                    column.getDefault() ? `DEFAULT ${column.getDefault()}` : ""
                } ${column.getCheck() ? `CHECK (${column.getCheck()})` : ""}`.trim()
            );
        });
    }

    protected createPrimaryKey(table: Table) {
        const pkey = table.getPrimaryKey();
        if (pkey) {
            this.script.push(`ALTER TABLE ${table.getName()} ADD PRIMARY KEY (${pkey.getColumnNames().join(",")})`);
        }
    }

    protected createUniqueConstraints(table: Table) {
        const me = this;
        table.getConstraints(eDBConstraintType.unique).forEach(item => {
            me.script.push(`ALTER TABLE ${table.getName()} ADD UNIQUE (${item.getColumnNames().join(",")})`);
        });
    }

    protected createForeignKeyConstraints(table: Table) {
        const me = this;
        table.getConstraints<ForeignKeyConstraint>(eDBConstraintType.foreignKey).forEach(item => {
            me.script.push(
                `ALTER TABLE ${table.getName()} ADD FOREIGN KEY (${item
                    .getColumnNames()
                    .join(",")}) REFERENCES ${item.getRefTable().getName()} (${item
                    .getRefColumns()
                    .join(",")}) ON UPDATE ${me.mapRefAction(item.getOnUpdate())} ON DELETE ${me.mapRefAction(
                    item.getOnDelete()
                )}`
            );
        });
    }

    protected createInternal() {
        this.tables.forEach(table => {
            this.dropTable(table);
        });
        this.tables.forEach(table => {
            this.createTable(table);
            this.createColumns(table);
            this.createPrimaryKey(table);
            this.createUniqueConstraints(table);
        });
        this.tables.forEach(table => {
            this.createForeignKeyConstraints(table);
        });
        executeQuery(this.script.join(";\n")).then(() => {
            pool.end();
        });
    }
}

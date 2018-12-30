/**
 * Enum providing generic database types
 *
 * @export
 * @enum {number}
 */
export enum eDBColumnType {
    autoIncrement,
    number,
    string,
    boolean,
    dateTime,
    guid,
    decimal
}

/**
 * Enum providing action on foreign key actions types.
 *
 * @export
 * @enum {number}
 */
export enum eDBForeignKeyAction {
    cascade,
    setNull
}

/**
 * Enum providing generic constraint types.
 *
 * @export
 * @enum {number}
 */
export enum eDBConstraintType {
    primaryKey,
    foreignKey,
    unique
}

/**
 * Interface for configuring generic meta data of a database column.
 *
 * @export
 * @interface IColumnOptions
 */
export interface IColumnOptions {
    unique?: boolean;
    nullable?: boolean;
    default?: string;
    check?: string;
}

/**
 * Interface for configuring action types of foreign keys.
 *
 * @export
 * @interface IForeignKeyAction
 */
export interface IForeignKeyAction {
    onUpdate: eDBForeignKeyAction;
    onDelete: eDBForeignKeyAction;
}

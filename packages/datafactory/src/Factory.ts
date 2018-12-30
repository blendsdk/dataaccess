import { Pool, QueryResult } from "pg";
import { pg as yesql } from "yesql";
import { logger } from "./logger";

const pool = new Pool();

/**
 * Interface for describing a generated sql statement.
 *
 * @protected
 * @interface ISqlStatement
 */
export interface ISqlStatement {
    statement: string;
    params: any;
}

/**
 * Base class for creating a database factory class.
 *
 * @export
 * @abstract
 * @class Factory
 */
export abstract class Factory {
    /**
     * Execute a SQL query and return a QueryResult object
     *
     * @protected
     * @param {string} stmt
     * @param {*} [params]
     * @returns {Promise<QueryResult>}
     * @memberof Factory
     */
    protected query(stmt: string, params?: any): Promise<QueryResult> {
        const yq = yesql(stmt)(params);
        logger.debug(yq);
        return pool.query(yq.text, yq.values || []);
    }

    /**
     * Execute a SQL query and return the number of affected records.
     *
     * @protected
     * @param {string} stmt
     * @param {*} [params]
     * @returns {Promise<number>}
     * @memberof Factory
     */
    protected executeNonQuery(stmt: string, params?: any): Promise<number> {
        const me = this;
        return new Promise(async (resolve, reject) => {
            try {
                const result = await me.query(stmt, params);
                resolve(result.rowCount);
            } catch (err) {
                reject(err);
            }
        });
    }

    /**
     * Execute a SQL query and return and array of records.
     *
     * @protected
     * @template T
     * @param {string} stmt
     * @param {*} [params]
     * @returns {Promise<T[]>}
     * @memberof Factory
     */
    public executeQuery<T>(stmt: string, params?: any): Promise<T[]> {
        const me = this;
        return new Promise(async (resolve, reject) => {
            try {
                const result = await me.query(stmt, params);
                resolve((result.rowCount === 0 ? [] : result.rows) as T[]);
            } catch (err) {
                reject(err);
            }
        });
    }

    /**
     * Execute a SQL statement and return a single record.
     *
     * @protected
     * @template T
     * @param {string} stmt
     * @param {*} [params]
     * @returns {Promise<T>}
     * @memberof Factory
     */
    protected executeQuerySingle<T>(stmt: string, params?: any): Promise<T> {
        const me = this;
        return new Promise(async (resolve, reject) => {
            try {
                const result = await me.query(stmt, params);
                resolve((result.rowCount === 0 ? undefined : result.rows[0]) as T);
            } catch (err) {
                reject(err);
            }
        });
    }

    /**
     * Removes undefined values from a record object
     *
     * @protected
     * @param {*} values
     * @returns {string[]}
     * @memberof Factory
     */
    protected removeUndefined(values: any): string[] {
        values = values || {};
        return Object.keys(values).filter(name => {
            return (values as any)[name] !== undefined;
        });
    }

    /**
     * Creates an INSERT statement.
     *
     * @protected
     * @param {string} tableName
     * @param {*} values
     * @returns {ISqlStatement}
     * @memberof Factory
     */
    protected createInsertStatement(tableName: string, values: any): ISqlStatement {
        const me = this,
            fields = me.removeUndefined(values),
            params = fields.map(name => {
                return `:${name}`;
            });
        return {
            statement: `INSERT INTO ${tableName} (${fields.join(",")}) VALUES (${params.join(",")}) RETURNING *`,
            params: values
        };
    }

    /**
     * Creates an UPDATE statement.
     *
     * @protected
     * @param {string} tableName
     * @param {*} setValues
     * @param {*} clauseValues
     * @returns {ISqlStatement}
     * @memberof Factory
     */
    protected createUpdateStatement(tableName: string, setValues: any, clauseValues: any): ISqlStatement {
        const me = this,
            allParams: any = {},
            setParams = me.removeUndefined(setValues).map(name => {
                allParams[name] = setValues[name];
                return `${name}=:${name}`;
            }),
            clauseParams = me.removeUndefined(clauseValues).map(name => {
                if (clauseValues[name] !== null) {
                    allParams[`_${name}`] = clauseValues[name];
                    return `${name}=:_${name}`;
                } else {
                    return `${name} IS NULL`;
                }
            });

        return {
            statement: `UPDATE ${tableName} SET ${setParams.join(",")} WHERE ${clauseParams.join(" AND ")} RETURNING *`,
            params: allParams
        };
    }
}

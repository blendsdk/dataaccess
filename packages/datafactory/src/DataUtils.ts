import { DataFactory } from "./DataFactory";

/**
 * This class provides common database utility methods.
 *
 * @export
 * @class DataUtilsSingleton
 * @extends {DataFactory}
 */
export class DataUtilsSingleton extends DataFactory {
    /**
     * Truncates all tables.
     *
     * @param {string} username
     * @returns
     * @memberof DataUtilsSingleton
     */
    public truncateAllTables(username: string) {
        const sql = `
		CREATE OR REPLACE FUNCTION truncate_tables(username IN VARCHAR) RETURNS void AS $$
		DECLARE
			statements CURSOR FOR
				SELECT tablename FROM pg_tables
				WHERE tableowner = username AND schemaname = 'public';
		BEGIN
			FOR stmt IN statements LOOP
				EXECUTE 'TRUNCATE TABLE ' || quote_ident(stmt.tablename) || ' CASCADE;';
			END LOOP;
		END;
		$$ LANGUAGE plpgsql;
		SELECT truncate_tables('${username}');
		`;
        return this.executeNonQuery(sql);
    }

    /**
     * Closes all connection in the connection Pool
     *
     * @returns {Promise<void>}
     * @memberof DataUtilsSingleton
     */
    public closeConnections(): Promise<void> {
        return this.endConnectionPool();
    }
}

export const DataUtils = new DataUtilsSingleton();

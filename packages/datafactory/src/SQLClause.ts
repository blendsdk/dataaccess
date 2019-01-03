/**
 * Simple wrapper to describe a SQL clause
 *
 * @export
 * @class SQLClause
 */
export class SQLClause {
    /**
     * Cashes the value.
     *
     * @protected
     * @type {*}
     * @memberof SQLClause
     */
    protected value: any;
    /**
     * Caches the operator
     *
     * @protected
     * @type {string}
     * @memberof SQLClause
     */
    protected operator: string;

    /**
     * Creates an instance of SQLClause.
     * @param {string} operator
     * @param {*} value
     * @memberof SQLClause
     */
    public constructor(operator: string, value: any) {
        this.operator = operator;
        this.value = value;
    }

    /**
     * Gets the operator
     *
     * @returns {string}
     * @memberof SQLClause
     */
    public getOperator(): string {
        return this.operator;
    }

    /**
     * Gets the value.
     *
     * @returns {string}
     * @memberof SQLClause
     */
    public getValue(): string {
        return this.value;
    }
}

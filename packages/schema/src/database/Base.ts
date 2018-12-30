/**
 * Base class for creating a database object
 *
 * @export
 * @abstract
 * @class Base
 */
export abstract class Base {
    /**
     * Internal name of this object
     *
     * @protected
     * @type {string}
     * @memberof Base
     */
    protected name: string;

    /**
     * Creates an instance of Base.
     * @param {string} name
     * @memberof Base
     */
    public constructor(name: string) {
        this.name = name;
    }

    /**
     * Get the name of this object.
     *
     * @returns {string}
     * @memberof Base
     */
    public getName(): string {
        return this.name;
    }
}

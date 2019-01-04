import { Response } from "express";
import { Result } from "express-validator/check";
import { HttpStatus } from "./HttpStatus";
import { wrapInArray } from "./Utils";

/**
 * Http Response Wrapper
 *
 * @export
 * @class HttpResponse
 */
export class HttpResponse {
    /**
     * Internal Response object
     *
     * @protected
     * @type {Response}
     * @memberof HttpResponse
     */
    protected response: Response;

    /**
     * Creates an instance of HttpResponse.
     * @param {Response} response
     * @memberof HttpResponse
     */
    public constructor(res: Response) {
        this.response = res;
    }

    /**
     * Provides an OK response.
     *
     * @template T
     * @param {Response} res
     * @param {T} data
     * @returns {Response}
     * @memberof HttpResponse
     */
    public OK<T extends any>(res: Response, data: T): Response {
        return res.status(HttpStatus.Success.OK).json(data);
    }

    /**
     * Creates a validation error response.
     *
     * @param {Result<any>} errors
     * @returns
     * @memberof HttpResponse
     */
    public validationError(errors: Result<any>) {
        return this.error(HttpStatus.ClientErrors.BadRequest, errors.array());
    }

    /**
     * Provides an error response.
     *
     * @param {number} code
     * @param {(any | any[])} error
     * @returns {Response}
     * @memberof HttpResponse
     */
    public error(code: number, error: any | any[]): Response {
        return this.response.status(code).json({
            error: true,
            messages: wrapInArray(error)
        });
    }

    /**
     * Send an Unauthorized error response
     *
     * @param {(any | any[])} error
     * @returns {Response}
     * @memberof HttpResponse
     */
    public unAuthorized(error: any | any[]): Response {
        return this.error(HttpStatus.ClientErrors.Unauthorized, error);
    }
}

/**
 * The HttpResponse instance builder.
 * @param res
 */
export const response = (res: Response): HttpResponse => {
    return new HttpResponse(res);
};

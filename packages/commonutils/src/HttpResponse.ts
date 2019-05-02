import { Request, Response } from "express";
import { Result, validationResult } from "express-validator/check";
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
	 * Internal Request object
	 *
	 * @protected
	 * @type {Request}
	 * @memberof HttpResponse
	 */
	protected request: Request;

    /**
     * Creates an instance of HttpResponse.
     * @param {Response} response
     * @memberof HttpResponse
     */
	public constructor(res: Response) {
		this.response = res;
		this.request = res.req;
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
	public OK<T extends any>(data: T): Response {
		return this.response.status(HttpStatus.Success.OK).json(data);
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
	 * Sends an InternalServerError (500) response
	 *
	 * @param {(any | any[])} error
	 * @returns {Response}
	 * @memberof HttpResponse
	 */
	public serverError(error: any | any[]): Response {
		return this.error(HttpStatus.ServerErrors.InternalServerError, error);
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
 * Handles a request with express validation
 *
 * @export
 * @param {Request} req
 * @param {Response} res
 * @param {(req?: Request, res?: Response) => Promise<Response>} callback
 * @returns {Promise<Response>}
 */
export function withValidation(request: Request,
	// tslint:disable-next-line:align
	callback: (req?: Request, res?: Response) => Promise<Response>
): Promise<Response> {
	const resp: Response = request.res;
	return new Promise((resolve, reject) => {
		try {
			const errors = validationResult(request);
			if (errors.isEmpty()) {
				resolve(callback(request, resp));
			} else {
				resolve(response(resp).validationError(errors));
			}
		} catch (err) {
			reject(response(resp).error(HttpStatus.ServerErrors.InternalServerError, err));
		}
	});
}

/**
 * The HttpResponse instance builder.
 * @param res
 */
export const response = (res: Response): HttpResponse => {
	return new HttpResponse(res);
};

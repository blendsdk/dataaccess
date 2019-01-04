interface IHttpStatusClientErrors {
    /**
     * The server cannot or will not process the request due to an apparent client error.
     *
     * @type {number}
     */
    BadRequest: number;
    /**
     * Similar to 403 Forbidden, but specifically for use when authentication is required and has failed
     * or has not yet been provided. The response must include a WWW-Authenticate header field containing a
     * challenge applicable to the requested resource.
     * @type {number}
     */
    Unauthorized: number;
    /**
     * Reserved for future use. The original intention was that this code might be used as part of some form of digital cash or
     * micro-payment scheme, as proposed for example by GNU Taler, but that has not yet happened, and this code is not usually used.
     * Google Developers API uses this status if a particular developer has exceeded the daily limit on requests.
     *
     * @type {number}
     */
    PaymentRequired: number;
    /**
     * The request was valid, but the server is refusing action. The user might not have the necessary permissions for
     * a resource, or may need an account of some sort.
     *
     * @type {number}
     */
    Forbidden: number;
    /**
     * The requested resource could not be found but may be available in the future.
     * Subsequent requests by the client are permissible.
     *
     * @type {number}
     */
    NotFound: number;
    /**
     * A request method is not supported for the requested resource; for example, a GET request on a form that
     * requires data to be presented via POST, or a PUT request on a read-only resource.
     *
     * @type {number}
     */
    MethodNotAllowed: number;
    /**
     * The requested resource is capable of generating only content not acceptable according to
     * the Accept headers sent in the request.
     *
     * @type {number}
     */
    NotAcceptable: number;
    /**
     * The client must first authenticate itself with the proxy.
     * @type {number}
     */
    ProxyAuthenticationRequired: number;
    /**
     * The server timed out waiting for the request.
     *
     * @type {number}
     */
    RequestTimeout: number;
    /**
     * Indicates that the request could not be processed because of conflict in the current state
     * of the resource, such as an edit conflict between multiple simultaneous updates.
     *
     * @type {number}
     */
    Conflict: number;
    /**
     * Indicates that the resource requested is no longer available and will not be available again.
     *
     * @type {number}
     */
    Gone: number;
    /**
     * The request did not specify the length of its content, which is required by the requested resource.
     *
     * @type {number}
     */
    LengthRequired: number;
    /**
     * The request did not specify the length of its content, which is required by the requested resource.
     *
     * @type {number}
     */
    PreconditionFailed: number;
    /**
     * The request is larger than the server is willing or able to process.
     *
     * @type {number}
     */
    PayloadTooLarge: number;
    /**
     * The URI provided was too long for the server to process. Often the result of too much data being
     * encoded as a query-string of a GET request, in which case it should be converted to a POST request.
     *
     * @type {number}
     */
    URITooLong: number;
    /**
     * The request entity has a media type which the server or resource does not support.
     * For example, the client uploads an image as image/svg+xml, but the server
     * requires that images use a different format.
     *
     * @type {number}
     */
    UnsupportedMediaType: number;
    /**
     * The client has asked for a portion of the file (byte serving), but the server cannot supply that portion.
     *
     * @type {number}
     */
    RangeNotSatisfiable: number;
    /**
     * The server cannot meet the requirements of the Expect request-header field.
     *
     * @type {number}
     */
    ExpectationFailed: number;
    /**
     * This code was defined in 1998 as one of the traditional IETF April Fools' jokes, in RFC 2324,
     * Hyper Text Coffee Pot Control Protocol, and is not expected to be implemented by actual HTTP servers.
     *
     * @type {number}
     */
    ImATeapot: number;
    /**
     * The request was directed at a server that is not able to produce a response.
     *
     * @type {number}
     */
    MisdirectedRequest: number;
    /**
     * The request was well-formed but was unable to be followed due to semantic errors.
     *
     * @type {number}
     */
    UnprocessableEntity: number;
    /**
     * The resource that is being accessed is locked.
     *
     * @type {number}
     */
    Locked: number;
    /**
     * The request failed because it depended on another request and that request failed (e.g., a PROPPATCH).
     *
     * @type {number}
     */
    FailedDependency: number;
    /**
     * The client should switch to a different protocol such as TLS/1.0, given in the Upgrade header field.
     *
     * @type {number}
     */
    UpgradeRequired: number;
    /**
     * The origin server requires the request to be conditional. Intended to prevent
     * the 'lost update' problem, where a client GETs a resource's state, modifies it, and PUTs it back to the server,
     * when meanwhile a third party has modified the state on the server, leading to a conflict."
     *
     * @type {number}
     */
    PreconditionRequired: number;
    /**
     * The user has sent too many requests in a given amount of time.
     * Intended for use with rate-limiting schemes.
     *
     * @type {number}
     */
    TooManyRequests: number;
    /**
     * The server is unwilling to process the request because either an individual header field,
     * or all the header fields collectively, are too large.
     *
     * @type {number}
     */
    RequestHeaderFieldsTooLarge: number;
    /**
     * A server operator has received a legal demand to deny access to a resource or to a set of
     * resources that includes the requested resource.
     *
     * @type {number}
     */
    UnavailableForLegalReasons: number;
}

interface IHttpStatusServerErrors {
    /**
     * A generic error message, given when an unexpected condition was
     * encountered and no more specific message is suitable.[62]
     * @type {number}
     */
    InternalServerError: number;
    /**
     * The server either does not recognize the request method, or it lacks the ability to fulfil the request.
     * Usually this implies future availability (e.g., a new feature of a web-service API).
     * @type {number}
     */
    NotImplemented: number;
    /**
     * The server was acting as a gateway or proxy and received an invalid
     * response from the upstream server.
     *
     * @type {number}
     */
    BadGateway: number;
    /**
     * The server is currently unavailable (because it is overloaded or down for maintenance).
     * Generally, this is a temporary state.
     * @type {number}
     */
    ServiceUnavailable: number;
    /**
     * The server was acting as a gateway or proxy and did not receive a timely
     * response from the upstream server.
     * @type {number}
     */
    GatewayTimeout: number;
    /**
     * The server does not support the HTTP protocol version used in the request.
     * @type {number}
     */
    HTTPVersionNotSupported: number;
    /**
     * Transparent content negotiation for the request results in a circular reference.
     * @type {number}
     */
    VariantAlsoNegotiates: number;
    /**
     * The server is unable to store the representation needed to complete the request.
     * @type {number}
     */
    InsufficientStorage: number;
    /**
     * The server detected an infinite loop while processing the request (sent instead of 208 Already Reported).
     * @type {number}
     */
    LoopDetected: number;
    /**
     * Further extensions to the request are required for the server to fulfil it.
     * @type {number}
     */
    NotExtended: number;
    /**
     * The client needs to authenticate to gain network access. Intended for use by intercepting proxies
     * used to control access to the network.
     * @type {number}
     */
    NetworkAuthenticationRequired: number;
}

interface IHttpStatusSuccess {
    /**
     * Standard response for successful HTTP requests. The actual response will depend on the request method used.
     * In a GET request, the response will contain an entity corresponding to the requested resource.
     * In a POST request, the response will contain an entity describing or containing the result of the action.
     *
     * @type {number}
     * @memberof IHttpStatusSuccess
     */
    OK: number;
    /**
     * The request has been fulfilled, resulting in the creation of a new resource.
     *
     * @type {number}
     * @memberof IHttpStatusSuccess
     */
    Created: number;
    /**
     * The request has been accepted for processing, but the processing has not been completed.
     * The request might or might not be eventually acted upon, and may be disallowed when processing occurs.
     *
     * @type {number}
     * @memberof IHttpStatusSuccess
     */
    Accepted: number;
    /**
     * The server is a transforming proxy (e.g. a Web accelerator) that received a 200 OK from its origin,
     * but is returning a modified version of the origin's response.
     *
     * @type {number}
     * @memberof IHttpStatusSuccess
     */
    NonAuthoritativeInformation: number;
    /**
     * The server successfully processed the request and is not returning any content.
     *
     * @type {number}
     * @memberof IHttpStatusSuccess
     */
    NoContent: number;
    /**
     * The server successfully processed the request, but is not returning any content.
     * Unlike a 204 response, this response requires that the requester reset the document view.
     *
     * @type {number}
     * @memberof IHttpStatusSuccess
     */
    ResetContent: number;
    /**
     * The server is delivering only part of the resource (byte serving) due to a range
     * header sent by the client. The range header is used by HTTP clients to enable resuming
     * of interrupted downloads, or split a download into multiple simultaneous streams.
     *
     * @type {number}
     * @memberof IHttpStatusSuccess
     */
    PartialContent: number;
    /**
     * The message body that follows is by default an XML message and can contain a number
     * of separate response codes, depending on how many sub-requests were made.
     *
     * @type {number}
     * @memberof IHttpStatusSuccess
     */
    MultiStatus: number;
    /**
     * The members of a DAV binding have already been enumerated in a preceding part of
     * the (multistatus) response, and are not being included again.
     *
     * @type {number}
     * @memberof IHttpStatusSuccess
     */
    AlreadyReported: number;
    /**
     * The server has fulfilled a request for the resource, and the response is a representation of
     * the result of one or more instance-manipulations applied to the current instance.
     *
     * @type {number}
     * @memberof IHttpStatusSuccess
     */
    IMUsed: number;
}

interface IHttpStatus {
    ClientErrors: IHttpStatusClientErrors;
    ServerErrors: IHttpStatusServerErrors;
    Success: IHttpStatusSuccess;
}

export const HttpStatus: IHttpStatus = {
    ClientErrors: {
        BadRequest: 400,
        Unauthorized: 401,
        PaymentRequired: 402,
        Forbidden: 403,
        NotFound: 404,
        MethodNotAllowed: 405,
        NotAcceptable: 406,
        ProxyAuthenticationRequired: 407,
        RequestTimeout: 408,
        Conflict: 409,
        Gone: 410,
        LengthRequired: 411,
        PreconditionFailed: 412,
        PayloadTooLarge: 413,
        URITooLong: 414,
        UnsupportedMediaType: 415,
        RangeNotSatisfiable: 416,
        ExpectationFailed: 417,
        ImATeapot: 418,
        MisdirectedRequest: 421,
        UnprocessableEntity: 422,
        Locked: 423,
        FailedDependency: 424,
        UpgradeRequired: 426,
        PreconditionRequired: 428,
        TooManyRequests: 429,
        RequestHeaderFieldsTooLarge: 431,
        UnavailableForLegalReasons: 451
    },
    ServerErrors: {
        InternalServerError: 500,
        NotImplemented: 501,
        BadGateway: 502,
        ServiceUnavailable: 503,
        GatewayTimeout: 504,
        HTTPVersionNotSupported: 505,
        VariantAlsoNegotiates: 506,
        InsufficientStorage: 507,
        LoopDetected: 508,
        NotExtended: 510,
        NetworkAuthenticationRequired: 511
    },
    Success: {
        OK: 200,
        Created: 201,
        Accepted: 202,
        NonAuthoritativeInformation: 203,
        NoContent: 204,
        ResetContent: 205,
        PartialContent: 206,
        MultiStatus: 207,
        AlreadyReported: 208,
        IMUsed: 226
    }
};

type ConfigType = {};
type FormatErrorType = {};

declare module 'graphql-apollo-errors' {
  declare var SevenBoom: {
    badRequest: Function,
    unauthorized: Function,
    paymentRequired: Function,
    forbidden: Function,
    notFound: Function,
    methodNotAllowed: Function,
    notAcceptable: Function,
    proxyAuthRequired: Function,
    clientTimeout: Function,
    conflict: Function,
    resourceGone: Function,
    lengthRequired: Function,
    preconditionFailed: Function,
    entityTooLarge: Function,
    uriTooLong: Function,
    unsupportedMediaType: Function,
    rangeNotSatisfiable: Function,
    expectationFailed: Function,
    teapot: Function,
    badData: Function,
    locked: Function,
    preconditionRequired: Function,
    tooManyRequests: Function,
    illegal: Function,
    badImplementation: Function,
    notImplemented: Function,
    badGateway: Function,
    serverUnavailable: Function,
    gatewayTimeout: Function,
  };
  declare var formatErrorGenerator: (config: ConfigType) => FormatErrorType;
}

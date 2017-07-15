import pino from 'pino';
// Use config to externalize the configuration
import config from 'config';

const verboseLevel = config.get('Logger.verboseLevel');

const logger = (opts, stream) => {
  opts = opts || {};
  opts.serializers = opts.serializers || {};
  opts.serializers.req = opts.serializers.req || asReqValue;
  opts.serializers.res = opts.serializers.res || asResValue;
  opts.serializers.err = opts.serializers.err || asErrValue;

  opts.useLevel = opts.useLevel || 'info';

  var theStream = opts.stream || stream;
  delete opts.stream;

  const middleware = async (ctx, next) => {
    ctx.log = ctx.request.log = ctx.response.log = ctx.req.log = pino(opts, theStream);
    let logReq: object | string = {};
    switch (verboseLevel) {
      case 1:
        logReq = `${ctx.req.method} ${ctx.request.url} (req-id : "${ctx.req.id}")`;
        break;
      case 2:
        logReq.req = ctx.req;
        break;
      case 0:
      default:
        break;
    }
    ctx.log.child({ name: 'req' }).info(logReq);
    ctx.onerror = catchErr(ctx, ctx.onerror);
    const startTime = Date.now();

    await next();

    let logRes: object | string = {};

    const responseTime = Date.now() - startTime;
    switch (verboseLevel) {
      case 1:
        logRes = `responded in ${responseTime}ms (req-id: "${ctx.req.id}")`;
        break;
      case 2:
        logRes.req = ctx.res;
        logRes.responseTime = responseTime;
        break;
      case 0:
      default:
        break;
    }
    ctx.log.child({ name: 'res' }).info(logRes);
    ctx.set('X-Response-Time', `${responseTime}ms`);
  };
  return middleware;
};

function catchErr(ctx, handler) {
  return function(e) {
    if (!e) {
      return handler.call(ctx, e);
    }
    ctx.log.error(
      {
        res: ctx.res,
        err: {
          type: e.constructor.name,
          message: e.message,
          stack: e.stack,
        },
        responseTime: ctx.res.responseTime,
      },
      'request errored'
    );
    return handler.call(ctx, e);
  };
}

function asReqValue(req) {
  return {
    id: req.id,
    method: req.method,
    body: req.body,
    url: req.url,
    headers: req.headers,
    remoteAddress: req.connection.remoteAddress,
    remotePort: req.connection.remotePort,
  };
}

function asResValue(res) {
  return {
    statusCode: res.statusCode,
    header: res.getHeaders(),
  };
}

function asErrValue(err) {
  var obj = {
    type: err.constructor.name,
    message: err.message,
    stack: err.stack,
  };
  for (var key in err) {
    if (obj[key] === undefined) {
      obj[key] = err[key];
    }
  }
  return obj;
}

export default logger;

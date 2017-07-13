/**
 * @description: this file starts the web server
 *
 * @todo : split the middlewares in small pieces
 *
 * @flow
 */

// Import koa 2, the modern express
import koa from 'koa';
// Import koa 2router, so we can mount graphQl under the /graphql endpoint
import koaRouter from 'koa-router';
// Import koa 2 bodyparser, to parse the html bodycontaining the query
// and pass the decoded string to graphql
import koaBody from 'koa-bodyparser';
// Import helmet middleware to add extra security for free
import helmet from 'koa-helmet';
// Use config to externalize the configuration
import config from 'config';
// import graphqlKoa and graphiql
import { graphqlKoa } from 'graphql-server-koa';
// import jwt-verification
import koaJwt from 'koa-jwt';
// and jwks to delegate the auth to auth0
import jwksRsa from '@tychot/jwks-rsa';
// import view to render the static login page
import koaViews from 'koa-views';
// instrument graphql
import OpticsAgent from 'optics-agent';

// create a new app
const app = new koa();
// create a new router, not really usefull for now
const router = new koaRouter();

// use the helmet middleware, to offfer a bit of extra security
app.use(helmet());

// use the body middlleware, to decode the body of the request
app.use(koaBody());

const bunyan = require('bunyan');
const koaBunyanLogger = require('koa-bunyan-logger');
let logger = bunyan.createLogger({
  name: 'website',
  stream: process.stdout,
  level: 'debug',
  serializers: bunyan.stdSerializers,
});
logger.req = logger.child({
  component: 'req',
  level: 'info',
});
app.use(koaBunyanLogger(logger.req));
app.use(koaBunyanLogger.requestIdContext());
app.use(koaBunyanLogger.requestLogger());

// use the ect template string for views
import path from 'path';
app.use(
  koaViews(path.join(__dirname, 'views'), {
    map: {
      html: 'ect',
    },
  })
);

// configure jwt middleware to connect to auth0, check the token and
const jwtConfig = {
  secret: jwksRsa.koaJwtSecret(config.get('Security.jwks')),
  ...config.get('Security.jwt'),
  passthrough: true,
};
app.use(koaJwt(jwtConfig));

app.use(OpticsAgent.koaMiddleware());

// import the schema and mount it under /graphql
import schema from '../presentation/schema';
import getViewerAndRoles from '../business/utils/auth';

// get the dataloader for each request
import * as business from '../business';
router.post(
  '/graphql',
  graphqlKoa(async ctx => {
    const { user, roles } = await getViewerAndRoles(ctx.state.user);
    // build the data loader map, using reduce
    const dataloaders = Object.keys(business).reduce((dataloaders, loaderKey) => {
      return { ...dataloaders, [loaderKey]: business[loaderKey].getLoaders() };
    }, {});
    // create an optic context
    const opticsContext = OpticsAgent.context(ctx.request);
    // create a context for each request
    const context = { dataloaders, user, roles, opticsContext };
    return {
      // instrument the schema
      schema: OpticsAgent.instrumentSchema(schema),
      context,
    };
  })
);

// redirect to graphiql
router.get('/', ctx => {
  return ctx.redirect('/graphiql');
});

// create the /graphiql endpoint and connect it to the /graphql
router.get('/graphiql', ctx => {
  return ctx.render('graphiql', {});
});

router.get('/login', ctx => {
  return ctx.render('login', {});
});

// use the router routes and restrict the method
app.use(router.routes());
app.use(router.allowedMethods());

// start the app and listen to incomming request
app.listen(config.get('Server.port'));

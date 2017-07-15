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
// log information in a scalable way
import logger from './middlewares/logger';
// log sql query
import knexMiddleware from './middlewares/knex';
import knex from '../db';
// add a request id to the response
import koaRequestId from 'koa-requestid';

// create a new app
const app = new koa();
// create a new router, not really usefull for now
const router = new koaRouter();

// use the helmet middleware, to offfer a bit of extra security
app.use(helmet());

// add request id to response and request state
app.use(koaRequestId());
app.use(async (ctx, next) => {
  ctx.req.id = ctx.state.id;
  await next();
});

// use the body middlleware, to decode the body of the request
app.use(koaBody());

// use the loging middleware, to log request and log special event
// override koa's undocumented error handler
app.context.onerror = () => {};
// specify that this is our api
app.context.api = true;
// use our logger middleware
app.use(logger());

app.use(knexMiddleware(knex));

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

import { formatErrorGenerator } from 'graphql-apollo-errors';

// get the dataloader for each request
import * as business from '../business';
router.post(
  '/graphql',
  graphqlKoa(async ctx => {
    // create error formatter
    const formatErrorConfig = {
      publicDataPath: 'public', // Only data under this path in the data object will be sent to the client (path parts should be separated by . - some.public.path)
      showLocations: false, // whether to add the graphql locations to the final error (default false)
      showPath: false, // whether to add the graphql path to the final error (default false)
      hideSensitiveData: true, // whether to remove the data object from internal server errors (default true)
      hooks: {
        // This run on the error you really throw from your code (not the graphql error - it means not with path and locations)
        onProcessedError: processedError => {
          ctx.log.child({ name: 'gql' }).warn({
            msg: `${processedError.output.payload.message} (${processedError.output.payload.guid})`,
            stack: processedError.stack,
          });
          ctx.status = processedError.output.statusCode || 500;
        },
      },
    };
    const formatError = formatErrorGenerator(formatErrorConfig);
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
      formatError,
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

/**
 * @description: this file starts the web server
 *
 * @todo : split the middlewares in small pieces
 *
 * @flow
 */

// Import koa 2, the modern express
const koa = require('koa');
// Import koa 2router, so we can mount graphQl under the /graphql endpoint
const koaRouter = require('koa-router');
// Import koa 2 bodyparser, to parse the html bodycontaining the query
// and pass the decoded string to graphql
const koaBody = require('koa-bodyparser');
// Import helmet middleware to add extra security for free
const helmet = require('koa-helmet');
// Use config to externalize the configuration
const config = require('config');
// import graphqlKoa and graphiql
const { graphqlKoa } = require('graphql-server-koa');
// import jwt-verification
const koaJwt = require('koa-jwt');
// and jwks to delegate the auth to auth0
const jwksRsa = require('@tychot/jwks-rsa');
// import view to render the static login page
const koaViews = require('koa-views');

// create a new app
const app = new koa();
// create a new router, not really usefull for now
const router = new koaRouter();

// use the helmet middleware, to offfer a bit of extra security
app.use(helmet());

// use the body middlleware, to decode the body of the request
app.use(koaBody());

// use the ect template string for views
const path = require('path');
app.use(
  koaViews(path.join(__dirname, 'views'), {
    map: {
      html: 'ect',
    },
  })
);

// configure jwt middleware to connect to auth0, check the token and
const jwtConfig = Object.assign(
  {},
  {
    secret: jwksRsa.koaJwtSecret(config.get('Security.jwks')),
  },
  config.get('Security.jwt'),
  { passthrough: true }
);
app.use(koaJwt(jwtConfig));

// import the schema and mount it under /graphql
const schema = require('../presentation/schema');
const queryBuilders = require('../db/queryBuilders');

// get the dataloader for each request
const business = require('../business');
router.post(
  '/graphql',
  graphqlKoa(async ({ state }) => {
    let user;
    const email = state.user && state.user.email;
    const isBamer = /^\w+@bam\.tech$/.test(email);
    if (email && isBamer) {
      user = await queryBuilders.bamer.getByEmail(email);
    }
    // build the data loader map, using reduce
    const dataloaders = Object.keys(business).reduce((dataloaders, loaderKey) => {
      return Object.assign({}, dataloaders, { [loaderKey]: business[loaderKey].getLoaders() });
    }, {});
    // create a context for each request
    const context = Object.assign({}, { dataloaders, user, isBamer });
    return {
      schema,
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

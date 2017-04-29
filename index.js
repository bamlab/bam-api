/**
 * @description: this file starts the web server
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
const { graphqlKoa, graphiqlKoa } = require('graphql-server-koa');

// create a new app
const app = new koa();
// create a new router, not really usefull for now
const router = new koaRouter();

// use the helmet middleware, to offfer a bit of extra security
app.use(helmet());

// use the body middlleware, to decode the body of the request
app.use(koaBody());

// import the schema and mount it under /graphql
const schema = require('./schema');
router.post('/graphql', graphqlKoa({ schema }));
// create the /graphiql endpoint and connect it to the /graphql
router.get('/graphiql', graphiqlKoa({ endpointURL: '/graphql' }));

// use the router routes and restrict the method
app.use(router.routes());
app.use(router.allowedMethods());

// start the app and listen to incomming request
app.listen(config.get('Server.port'));

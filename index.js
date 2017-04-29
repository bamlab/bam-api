/**
 * @description: this file load koa 2
 */

// Import koa 2, the modern express
const koa = require('koa');
// Import koa 2router, so we can mount graphQl under the /graphql endpoint
const koaRouter = require('koa-router');
// Import koa 2 bodyparser, to parse the html bodycontaining the query
// and pass the decoded string to graphql
const koaBody = require('koa-bodyparser');
// Use config to externalize the configuration
const config = require('config');

// create a new app
const app = new koa();
// create a new router, not really usefull for now
const router = new koaRouter();

// use the body middlleware, to decode the body of the request
app.use(koaBody());

// use the router routes, once defined
app.use(router.routes());
app.use(router.allowedMethods());

// start the app and listen to incomming request
app.listen(config.get('Server.port'));

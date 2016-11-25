/**
 * This file is where you define your application routes and controllers.
 *
 * Start by including the middleware you want to run for every request;
 * you can attach middleware to the pre('routes') and pre('render') events.
 *
 * For simplicity, the default setup for route controllers is for each to be
 * in its own file, and we import all the files in the /routes/views directory.
 *
 * Each of these files is a route controller, and is responsible for all the
 * processing that needs to happen for the route (e.g. loading data, handling
 * form submissions, rendering the view template, etc).
 *
 * Bind each route pattern your application should respond to in the function
 * that is exported from this module, following the examples below.
 *
 * See the Express application routing documentation for more information:
 * http://expressjs.com/api.html#app.VERB
 */

var keystone = require('keystone');
var babelify = require('babelify');
var bodyParser = require('body-parser');
var middleware = require('./middleware');
var importRoutes = keystone.importer(__dirname);
var clientConfig = require('../client/config');
var browserify = require('browserify-middleware');

// Common Middleware
keystone.pre('routes', middleware.initLocals);
keystone.pre('render', middleware.flashMessages);

// Import Route Controllers
var routes = {
	api: importRoutes('./api'),
	views: importRoutes('./views'),
};

// Setup Route Bindings
exports = module.exports = function (app) {
	// Views

	// Browserification
	app.get('/js/packages.js', browserify(clientConfig.packages, {
		cache: true,
		precompile: true,
	}));

	app.use('/js', browserify('./client/scripts', {
		external: clientConfig.packages,
		transform: [
			babelify.configure({
				presets: ['es2015', 'react']
			}),
		],
	}));

	app.get('/', routes.views.index);
	//app.get('/blog/:category?', routes.views.blog);
	//app.get('/blog/post/:post', routes.views.post);

	app.get('/add');
	app.get('/add/node/:node');

	//app.get('/gallery', routes.views.gallery);
	//app.all('/contact', routes.views.contact);

	// Api for
	app.get('/api/edge/list', keystone.middleware.api, routes.api.edges.list);
	app.get('/api/node/list', keystone.middleware.api, routes.api.nodes.list);
	//app.post('/uploadcsv_post', keystone.middleware.cors, routes.api.uploadcsv);

	// NOTE: To protect a route so that only admins can see it, use the requireUser middleware:
	// app.get('/protected', middleware.requireUser, routes.views.protected);

};
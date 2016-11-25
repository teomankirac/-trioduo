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
	
	//removed view from public
	
	app.get('/', routes.views.index);
	app.get('/add');
	app.get('/add/node/:node');
	
	// To get JSON endpoints for cytoscape

	// Api for
	app.get('/api/edge/list', keystone.middleware.api, routes.api.edges.list);
	app.get('/api/node/list', keystone.middleware.api, routes.api.nodes.list);
	
	//upload CSV and populate database option
	//app.post('/uploadcsv_post', keystone.middleware.cors, routes.api.uploadcsv);

};

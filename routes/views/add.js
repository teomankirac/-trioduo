var keystone = require('keystone');
var Node = keystone.list('Node');
var async = require('async');

exports = module.exports = function (req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;

	// Init locals
	locals.section = 'Add';

	locals.data = {
		nodes: [],
	};


// Load recent Nodes
view.query('data.nodes',
	Node.model.find()
		.where('state', 'published')
		.sort('-publishedDate')
		.populate('author')
		.limit('4000')
);

	// Render the view
	view.render('add');
};

var keystone = require('keystone');

var Node = keystone.list('Node');
var NodeComment = keystone.list('NodeComment');

exports = module.exports = function (req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;

	// Set locals
	locals.section = 'node';
	locals.filters = {
		node: req.params.node,
	};

	view.on('init', function(next) {

	Node.model.findOne()
		.where('slug', locals.filters.node)
		.populate('author')
		.exec(function(err, node) {

			if (err) return res.err(err);
			if (!node) return res.notfound('Node not found');

			// Allow admins or the author to see draft posts
			if (node.state == 'published' || (req.user && req.user.isAdmin) || (req.user && node.author && (req.user.id == node.author.id))) {
				locals.node = node;
				locals.node.populateRelated('comments[author]', next);
				//locals.page.title = node.title + ' - Buy - BuySwapSell';
			} else {
				return res.notfound('Node not found');
			}

		});

});

// Load recent Nodes
view.query('data.nodes',
	Node.model.find()
		.where('state', 'published')
		.sort('-publishedDate')
		.populate('author')
		.limit('4000')
);


	view.on('post', { action: 'create-comment' }, function(next) {

		// handle form
		var newNodeComment = new NodeComment.model({
				node: locals.node.id,
				author: locals.user.id
			}),
			updater = newNodeComment.getUpdateHandler(req, res, {
				errorMessage: 'There was an error creating your comment:'
			});

		updater.process(req.body, {
			flashErrors: true,
			logErrors: true,
			fields: 'content'
		}, function(err) {
			if (err) {
				locals.validationErrors = err.errors;
			} else {
				req.flash('success', 'Your comment has been added successfully.');
				return res.redirect('/add/node/' + locals.node.slug);
			}
			next();
		});

	});

	// Render the view
	view.render('node');
};

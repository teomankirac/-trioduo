var async = require('async'),
	keystone = require('keystone');

var Node = keystone.list('Node');

/**
 * List Nodes
 */
exports.list = function(req, res) {
	Node.model.find(function(err, items) {

		if (err) return res.apiError('database error', err);

		res.apiResponse({
			nodes: items
		});

	});
}

/**
 * Get Node by ID
 */
exports.get = function(req, res) {
	Node.model.findById(req.params.id).exec(function(err, item) {

		if (err) return res.apiError('database error', err);
		if (!item) return res.apiError('not found');

		res.apiResponse({
			node: item
		});

	});
}


/**
 * Create a Node
 */
exports.create = function(req, res) {

	var item = new Node.model(),
		data = (req.method == 'GET') ? req.body : req.query;

	item.getUpdateHandler(req).process(data, function(err) {

		if (err) return res.apiError('error', err);

		res.apiResponse({
			node: item
		});

	});
}

/**
 * Get Node by ID
 */
exports.update = function(req, res) {
	Node.model.findById(req.params.id).exec(function(err, item) {

		if (err) return res.apiError('database error', err);
		if (!item) return res.apiError('not found');

		var data = (req.method == 'GET') ? req.body : req.query;

		item.getUpdateHandler(req).process(data, function(err) {

			if (err) return res.apiError('create error', err);

			res.apiResponse({
				node: item
			});

		});

	});
}

/**
 * Delete Node by ID
 */
exports.remove = function(req, res) {
	Node.model.findById(req.params.id).exec(function (err, item) {

		if (err) return res.apiError('database error', err);
		if (!item) return res.apiError('not found');

		item.remove(function (err) {
			if (err) return res.apiError('database error', err);

			return res.apiResponse({
				success: true
			});
		});

	});
}

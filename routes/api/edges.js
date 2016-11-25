var async = require('async'),
	keystone = require('keystone');

var Edge = keystone.list('Edge');

/**
 * List Edges
 */
exports.list = function(req, res) {
	Edge.model.find(function(err, items) {

		if (err) return res.apiError('database error', err);

		res.apiResponse({
			edges: items
		});

	});
}

/**
 * Get Edge by ID
 */
exports.get = function(req, res) {
	Edge.model.findById(req.params.id).exec(function(err, item) {

		if (err) return res.apiError('database error', err);
		if (!item) return res.apiError('not found');

		res.apiResponse({
			edge: item
		});

	});
}


/**
 * Create a Edge
 */
exports.create = function(req, res) {

	var item = new Edge.model(),
		data = (req.method == 'GET') ? req.body : req.query;

	item.getUpdateHandler(req).process(data, function(err) {

		if (err) return res.apiError('error', err);

		res.apiResponse({
			edge: item
		});

	});
}

/**
 * Get Edge by ID
 */
exports.update = function(req, res) {
	Edge.model.findById(req.params.id).exec(function(err, item) {

		if (err) return res.apiError('database error', err);
		if (!item) return res.apiError('not found');

		var data = (req.method == 'GET') ? req.body : req.query;

		item.getUpdateHandler(req).process(data, function(err) {

			if (err) return res.apiError('create error', err);

			res.apiResponse({
				edge: item
			});

		});

	});
}

/**
 * Delete Edge by ID
 */
exports.remove = function(req, res) {
	Edge.model.findById(req.params.id).exec(function (err, item) {

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

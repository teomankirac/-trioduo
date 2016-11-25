var keystone = require('keystone'),
moment = require('moment'),
	async = require('async');


exports = module.exports = function (req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;

	// locals.section is used to set the currently selected
	// item in the header navigation.
	locals.section = 'home';

	locals.user = req.user;

	// Render the view
	view.render('index');

};

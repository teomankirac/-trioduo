require('dotenv').config();

// Require keystone
var keystone = require('keystone');

keystone.init({
	'name': 'trioduo',
	'brand': 'trioduo',

	'less': 'public',
	'static': 'public',
	'favicon': 'public/favicon.ico',
	'views': 'templates/views',
	'view engine': 'jade',

	'emails': 'templates/emails',

	'auto update': true,
	'session': true,
	'auth': true,
	'user model': 'User',

	'cookie secret': process.env.COOKIE_SECRET || 'trioduo',

	'wysiwyg override toolbar': false,
	'wysiwyg menubar': true,
	'wysiwyg skin': 'lightgray',

	'wysiwyg additional buttons': 'searchreplace visualchars,'
	 + ' charmap ltr rtl paste,',

  'wysiwyg cloudinary images': true,

	 extended_valid_elements : "iframe[src|width|height|name|align]",
});

// Load your project's Models
keystone.import('models');

keystone.set('locals', {
	_: require('lodash'),
	env: keystone.get('env'),
	utils: keystone.utils,
	editable: keystone.content.editable,
});

// Load your project's Routes
keystone.set('routes', require('./routes'));

// Setup common locals for your emails. The following are required by Keystone's
// default email templates, you may remove them if you're using your own.
keystone.set('email locals', {
	logo_src: '/images/logo-email.gif',
	logo_width: 194,
	logo_height: 76,
	theme: {
		email_bg: '#f9f9f9',
		link_color: '#2697de',
		buttons: {
			color: '#fff',
			background_color: '#2697de',
			border_color: '#1a7cb7',
		},
	},
});

// Load your project's email test routes
keystone.set('email tests', require('./routes/emails'));


// Configure the navigation bar in Keystone's Admin UI
keystone.set('nav', {
	nodes: ['nodes', 'edges', 'node-comments'],
	users: 'users',
});

// Start Keystone to connect to your database and initialise the web server

keystone.start();

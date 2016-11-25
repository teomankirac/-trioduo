var async = require('async');
var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Node Model
 * ==========
 */

var Node = new keystone.List('Node', {
	map: { name: 'title' },
	track: true,
	autokey: { path: 'slug', from: 'title', unique: true },
});

Node.add({

	title: { type: String, required: true },
	state: { type: Types.Select, options: 'draft, published, archived', default: 'published', index: true },
	author: { type: Types.Relationship, ref: 'User', index: true, hidden: true  },
	publishedDate: { type: Types.Date, index: true, dependsOn: { state: 'published' }, hidden: true },
	selected:{ type: Types.Boolean, hidden: true },

		data: {

			id: { type: String, default: '(name of the node which will be the "source" on edges, spell exactly)' },
			name: { type: String, index: true, default: '(Name which will be on node, has to be same as id)' },
			selected:{ type: Types.Boolean, hidden: true },
			image: { type: Types.CloudinaryImage, hidden: true },
			Description: {
				brief: { type: Types.Html, wysiwyg: true, height: 150 },
				extended: { type: Types.Html, wysiwyg: true, height: 400, hidden: true, },
			},
		  position: {
		      x: { type: Number, default: '4500', },
		      y: { type: Number, default: '4500', },
		  },

			Strength: { type: String, default: '5' },
			Quality: { type: String, default: '120' },
			NodeType: { 	type: Types.Select,
				options: [
					{ value: 'Salmon', label: 'Salmon' },
					{ value: 'Fixed', label: 'Purplish' },
					{ value: 'Task', label: 'Grey' },
					{ value: 'Blue', label: 'Blue' },
					{ value: 'Yellow', label: 'Yellow' },
					{ value: 'Green', label: 'Green' },
				],
				default: 'Salmon', label: 'Select your Color!',
			},

		},


});

Node.schema.virtual('description.full').get(function () {
	return this.description.extended || this.description.brief;
});

/**
 * Relationships
 * =============
 */

Node.relationship({ ref: 'NodeComment', refPath: 'node', path: 'comments' });

/**
 * Virtuals
 * ========
 */

 Node.schema.set('toJSON', {
     transform: function (doc, ret, options) {
         ret.id = ret._id;
         delete ret._id;
         delete ret.__v;
     }
});


/**
 * Notifications
 * =============
 */

Node.schema.methods.notifyAdmins = function(callback) {
	var Node = this;
	// Method to send the notification email after data has been loaded
	var sendEmail = function(err, results) {
		if (err) return callback(err);
		async.each(results.admins, function(admin, done) {
			new keystone.Email('admin-notification-new-node').send({
				admin: admin.name.first || admin.name.full,
				author: results.author ? results.author.name.full : 'Somebody',
				title: node.title,
				keystoneURL: 'http://www.trioduo.com/add/node/' + node.id,
				subject: 'New Node/Post to TrioDuo!'
			}, {
				to: admin,
				from: {
					name: 'TrioDup',
					email: 'contact@trioduo.com'
				}
			}, done);
		}, callback);
	}
	// Query data in parallel
	async.parallel({
		author: function(next) {
			if (!node.author) return next();
			keystone.list('User').model.findById(node.author).exec(next);
		},
		admins: function(next) {
			keystone.list('User').model.find().where('isAdmin', true).exec(next)
		}
	}, sendEmail);
};

Node.defaultSort = '-publishedDate';
Node.defaultColumns = 'title, state|20%, author|20%, publishedDate|20%';
Node.register();

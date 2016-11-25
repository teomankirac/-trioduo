var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
	Nodes
	=====
 */

var NodeComment = new keystone.List('NodeComment', {
	label: 'Comments',
});

NodeComment.add({
	author: { type: Types.Relationship, initial: true, ref: 'User', index: true },
	node: { type: Types.Relationship, initial: true, ref: 'Node', index: true },
	commentState: { type: Types.Select, options: ['published', 'draft', 'archived'], default: 'published', index: true },
	publishedOn: { type: Types.Date, default: Date.now, noedit: true, index: true },
});

NodeComment.add('Content', {
	content: { type: Types.Html, wysiwyg: true, height: 300 },
});

NodeComment.schema.pre('save', function (next) {
	//this.wasNew = this.isNew;
	if (!this.isModified('publishedOn') && this.isModified('commentState') && this.commentState === 'published') {
		this.publishedOn = new Date();
	}
	next();
});

NodeComment.schema.post('save', function () {
	if (!this.wasNew) return;
	if (this.author) {
		keystone.list('User').model.findById(this.author).exec(function (err, user) {
			if (user) {
				//user.wasActive().save();
			}
		});
	}
});

NodeComment.track = true;
NodeComment.defaultColumns = 'author, node, publishedOn, commentState';
NodeComment.register();

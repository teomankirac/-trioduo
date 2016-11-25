var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * User Model
 * ==========
 */
//var User = new keystone.List('User');

var User = new keystone.List('User', {
	track: true,
	autokey: { path: 'key', from: 'name', unique: true }
});

User.add({
	name: { type: Types.Name, required: true, index: true },
	email: { type: Types.Email, initial: true, required: true, index: true },
	password: { type: Types.Password, initial: true, required: true },
}, 'Profile', {
	//isPublic: { type: Boolean, default: true },
	//isOrganiser: Boolean,
	//organisation: { type: Types.Relationship, ref: 'Organisation' },
	photo: { type: Types.CloudinaryImage },
	//github: { type: String, width: 'short' },
	//twitter: { type: String, width: 'short' },
	//website: { type: Types.Url },
	//bio: { type: Types.Markdown },
	gravatar: { type: String, noedit: true }
}, 'Permissions', {
	isAdmin: { type: Boolean, label: 'Can access Keystone' },
});

// Provide access to Keystone
User.schema.virtual('canAccessKeystone').get(function () {
	return this.isAdmin;
});

// Pull out avatar image
User.schema.virtual('avatarUrl').get(function() {
	if (this.photo.exists) return this._.photo.thumbnail(120,120);
	if (this.services.github.isConfigured && this.services.github.avatar) return this.services.github.avatar;
	if (this.services.facebook.isConfigured && this.services.facebook.avatar) return this.services.facebook.avatar;
	if (this.services.google.isConfigured && this.services.google.avatar) return this.services.google.avatar;
	if (this.services.twitter.isConfigured && this.services.twitter.avatar) return this.services.twitter.avatar;
	if (this.gravatar) return 'http://www.gravatar.com/avatar/' + this.gravatar + '?d=http%3A%2F%2Fsydjs.com%2Fimages%2Favatar.png&r=pg';
});



/**
	Relationships
	=============
*/

//User.relationship({ ref: 'Post', refPath: 'author', path: 'posts' });
User.relationship({ ref: 'Node', refPath: 'author', path: 'nodes' });


/**
 * Registration
 */
User.defaultColumns = 'name, email, isAdmin';
User.register();

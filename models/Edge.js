var async = require('async');
var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Edge Model
 * ==========
 */

var Edge = new keystone.List('Edge', {
	map: { name: 'title' },
	track: true,
	autokey: { path: 'slug', from: 'title', unique: true },
});

Edge.add({

  title: { type: String, required: true },
	selected: { type: Types.Boolean, hidden: true },

		data: {
			selected: { type: Types.Boolean, hidden: true },
			interaction: { 	type: Types.Select,
				options: [
						{ value: 'cc', label: 'Grey' },
						{ value: 'cw', label: 'Blue' },
						{ value: 'cz', label: 'Green' },
						{ value: 'xy', label: 'Yellow' },
						{ value: 'xx', label: 'Salmon' },
				],
				default: 'cc', label: 'Select your line Color!',
			},
			source: { type: String },
			target: {
						type: Types.Select,
						options: [
								{ value: '1', label: 'TrioDuo' },
								{ value: '2', label: 'Creaction' },
								{ value: '3', label: 'Events' },
								{ value: '4', label: 'Wandering Thoughts' },
								{ value: '5', label: 'Moving Sounding' },
								{ value: '6', label: 'Reflection Wall' },
						],
				},
			},

	//interaction: { type: Types.Select, options: 'cc, cw', default: 'cc', index: true },
	//sharedInteraction: { type: Types.Select, options: 'cc, cw', default: 'cc', index: true },

  //canonicalName: { type: String, index: true },
  //SUID: { type: String, index: true },
  //sharedName:  { type: String, index: true },

});

/**
 * Virtuals
 * ========
 */


Edge.schema.set('toJSON', {
      transform: function (doc, ret, options) {
          ret.id = ret._id;
          delete ret._id;
          delete ret.__v;
      }
 });

Edge.relationship({ ref: 'Edge', refPath: 'node', path: 'nodes' });//something here!!!!! what is it!!!!

Edge.defaultColumns = 'title, edges';
Edge.register();

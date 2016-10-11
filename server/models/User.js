var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * User Model
 * ==========
 */

var User = new keystone.List('User');

User.add({
	userId: { type: String, required: true, initial: true, index: true },
	email: { type: Types.Email, initial: true, required: false, index: true },
	password: { type: Types.Password, initial: true, required: false },
	refuels: {type: Types.Relationship, ref: "Refuel", many: true},
	chatId: {type: String, required: true, initial: true},
	firstName: {type: String, required: true, initial: true}
}, 'Permissions', {
	isAdmin: { type: Boolean, label: 'Can access Keystone', index: true }
});

// Provide access to Keystone
User.schema.virtual('canAccessKeystone').get(function() {
	return this.isAdmin;
});


/**
 * Registration
 */

User.defaultColumns = 'firstName, userId, refuels, email, isAdmin, chatId';
User.register();

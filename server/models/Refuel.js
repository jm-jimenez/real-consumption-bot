var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Refuel Model
 * ==========
 */

var Refuel = new keystone.List('Refuel');

Refuel.add({
	odometer: { type: Number, required: true, initial: true},
	litres: { type: Number, initial: true, required: false},
	euros: { type: Number, initial: true, required: false },
	full: {type: Types.Boolean, initial: true, required: false}
});

/**
 * Registration
 */

Refuel.defaultColumns = 'odometer, litres, euros, full';
Refuel.register();

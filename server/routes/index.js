var keystone = require('keystone');
var middleware = require('./middleware');
var importRoutes = keystone.importer(__dirname);

// Common Middleware
keystone.pre('routes', middleware.initLocals);
keystone.pre('render', middleware.flashMessages);

// Import Route Controllers
var routes = {
	views: importRoutes('./views'),
	api: importRoutes('./api'),
	petitions: importRoutes('./petitions')
};

// Setup Route Bindings
exports = module.exports = function(app) {
	
	// Views
	app.all('/', routes.views.index);
	app.all('/home', routes.views.home);

	// Ajax petitions
	app.all('/insertRefuel', routes.petitions.newRefuel);

	// Bot routes
	app.all('/checkUserData', routes.api.checkUserData);
	app.all('/setCurrentOdometer', routes.api.setCurrentOdometer);
	app.all('/newRefuel', routes.api.newRefuel);
	app.all('/globalMileage', routes.api.globalMileage);
	app.all('/getAllChats', routes.api.getAllChats);
	app.all('/deleteUserData', routes.api.deleteUserData);
	app.all('/partialMileage', routes.api.partialMileage);
};

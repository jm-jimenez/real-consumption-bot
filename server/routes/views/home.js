var keystone = require('keystone'),
	User = keystone.list('User');

exports = module.exports = function(req, res) {

	

	var view = new keystone.View(req, res),
		locals = res.locals,
		userData = req.app.locals.userData;


	User.model.find()
		.where('userId', userData.uid)
		.populate('refuels')
		.exec()
		.then(function (result){
			var refuels = result[0].refuels;
			console.log (refuels);
			locals.refuels = refuels;
			view.render("home");
		}, function (err){
			console.log(err);
		});

		



};
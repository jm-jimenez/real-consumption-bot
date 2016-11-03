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

			var totalMileage = parseInt(refuels[refuels.length-1].totalOdometer);
			var totalLitres = parseFloat(refuels[refuels.length-1].totalLitres);
			var mileage = Math.round(100*totalLitres/totalMileage*100)/100 || 0;

			locals.refuels = refuels;
			locals.mileage = mileage;


			view.render("home");
		}, function (err){
			console.log(err);
		});

		



};
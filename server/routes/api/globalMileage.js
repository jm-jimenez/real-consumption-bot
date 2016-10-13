var keystone = require('keystone'),
	User = keystone.list('User'),
	Refuel = keystone.list('Refuel');

exports = module.exports = function(req, res) {
	
	var view = new keystone.View(req, res);
	var locals = res.locals;
	
	var uId = req.body.userId;

	User.model.find()
		.where("userId", uId)
		.select({_id: 0, refuels: 1})
		.populate({
			path: "refuels",
			options: {
				sort : {"odometer" : -1},
				limit: 1
			}
		})
		.exec()
		.then(function (result){
			var data = result[0].refuels[0];
			var totalMileage = parseInt(data.totalOdometer);
			var totalLitres = parseFloat(data.totalLitres);

			var mileage = 100*totalLitres/totalMileage || 0;

			res.send({"mileage" : mileage});

		}, function (err){
			console.log (err);
		});
	
};
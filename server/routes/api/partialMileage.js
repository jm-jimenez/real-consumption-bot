var keystone = require('keystone'),
	User = keystone.list('User'),
	Refuel = keystone.list('Refuel');

exports = module.exports = function(req, res) {
	
	var view = new keystone.View(req, res);
	var locals = res.locals;
	
	var uId = req.body.userId;
	var limit = req.body.limit;

	User.model.find()
		.where("userId", uId)
		.select({_id: 0, refuels: 1})
		.populate({
			path: "refuels",
			match: {"full" : true},
			options: {sort : {"odometer" : 1}}
		})
		.exec()
		.then(function (result){
			var mileages = [];
			var days = [];
			var refuels = result[0].refuels;
			for (var count=0, current = refuels.length - 1; count<limit; count++, current--){
				if (current >=1){
					
					var partialMileage = refuels[current].odometer - refuels[current-1].odometer;
					var partialLitres = refuels[current].totalLitres - refuels[current-1].totalLitres;
					var daysDiff = Math.round ((new Date (refuels[current].date).getTime() - new Date (refuels[current-1].date).getTime()) / (1000*60*60*24));
					var mileage = 100*partialLitres/partialMileage || 0;
					mileages.push(mileage);
					days.push(daysDiff);
				}
				else {
					count = limit;
				}
			}

			console.log(days);

			res.send({"mileages": mileages, "days": days});

		}, function (err){
			console.log (err);
		});
	
};
var keystone = require('keystone'),
	User = keystone.list('User'),
	Refuel = keystone.list('Refuel');

exports = module.exports = function(req, res) {
	
	var view = new keystone.View(req, res);
	var locals = res.locals;
	
	var uId = req.body.userId;

	console.log(uId);

	User.model.find()
		.where("userId", uId)
		.select({_id: 0, refuels: 1})
		.populate({
			path: "refuels",
			options: {sort : {"odometer" : 1}}
		})
		.exec()
		.then(function (result){
			var refuels = result[0].refuels;
			var totalMileage = parseInt(refuels[refuels.length-1].odometer) - parseInt(refuels[0].odometer);
			var totalLitres = 0;

			console.log("------BUCLE-----");
			for (var i=0, len=refuels.length; i<len; i++){
				if (typeof refuels[i].litres != "undefined"){
					totalLitres += refuels[i].litres;
				}
			}

			var mileage = 100*totalLitres/totalMileage;
			console.log ("totalLitres: " + totalLitres + ", totalMileage: " + totalMileage + ", mileage:" + mileage);

			res.send({"mileage" : mileage});

		}, function (err){
			console.log (err);
		});
	
};
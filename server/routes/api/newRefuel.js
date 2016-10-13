var keystone = require('keystone'),
	User = keystone.list('User'),
	Refuel = keystone.list('Refuel');

exports = module.exports = function(req, res) {
	
	var view = new keystone.View(req, res);
	var locals = res.locals;
	
	var userId = req.body.userId;
	var odometer = req.body.odo;
	var litres = req.body.litres;
	var euros = req.body.euros;
	var full = req.body.full;

	User.model.find()
		.where("userId", userId)
		.select({"_id": 0, "refuels": 1})
		.populate({
			path: "refuels",
			options: {
				limit : 1,
				sort: {"odometer" : -1}
			}
		})
		.exec()
		.then(function (results){
			console.log(results);
			var totalOdometer = results[0].refuels[0].totalOdometer || 0;
			var totalLitres = results[0].refuels[0].totalLitres || 0;
			var totalEuros = results[0].refuels[0].totalEuros || 0;
			var previousOdo = results[0].refuels[0].odometer || 0;

			totalOdometer = totalOdometer + (odometer-previousOdo);
			totalLitres = totalLitres + litres;
			totalEuros = totalEuros + euros;

			console.log(">>>>>> " + previousOdo + ", " + totalOdometer + ", " + totalLitres + ", " + totalEuros);

			var newRefuel = new Refuel.model({
				"odometer" : odometer,
				"litres" : litres,
				"euros" : euros,
				"userRef" : userId,
				"full": full,
				"totalOdometer": totalOdometer,
				"totalLitres": totalLitres,
				"totalEuros": totalEuros
			});

			newRefuel.save(function (err, result){
				User.model.update({"userId": userId}, {$push: {refuels: result._id}}, function (err, result2){
					res.send("true");
				});
			});

		}, function (err){

		});
	
	/**/
	
};
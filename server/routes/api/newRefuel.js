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
	
	var newRefuel = new Refuel.model({"odometer" : odometer, "litres" : litres, "euros" : euros, "userRef" : userId, "full": full});

	newRefuel.save(function (err, result){
		console.log(result._id);
		User.model.update({"userId": userId}, {$push: {refuels: result._id}}, function (err, result2){
			console.log("Updated");
			res.send("true");
		});
	});
	
};
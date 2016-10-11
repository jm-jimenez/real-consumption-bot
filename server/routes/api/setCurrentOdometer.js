var keystone = require('keystone'),
	User = keystone.list('User'),
	Refuel = keystone.list('Refuel');

exports = module.exports = function(req, res) {
	
	var view = new keystone.View(req, res);
	var locals = res.locals;
	
	var userId = req.body.userId;
	var odometer = req.body.odo;
	
	var newRefuel = new Refuel.model({"odometer" : odometer, "userRef": userId});

	newRefuel.save(function (err, result){
		console.log(result._id);
		var newUser = new User.model({"userId" : userId, refuels: result._id});
		newUser.save(function (err){
			res.send("true");
		});
	});
	
};
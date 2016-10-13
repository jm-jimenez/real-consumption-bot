var keystone = require('keystone'),
	User = keystone.list('User'),
	Refuel = keystone.list('Refuel');

exports = module.exports = function(req, res) {
	
	var view = new keystone.View(req, res);
	var locals = res.locals;
	
	var userId = req.body.userId;
	var odometer = req.body.odo;
	var chatId = req.body.chatId;
	var firstName = req.body.firstName;
	
	var newRefuel = new Refuel.model({"odometer" : odometer, "userRef": userId, "full": true, "litres" : 0, "euros": 0, "totalLitres": 0, "totalEuros" :0, "totalOdometer": 0});

	newRefuel.save(function (err, result){
		var newUser = new User.model({"userId" : userId, refuels: result._id, "chatId": chatId, "firstName" : firstName});
		newUser.save(function (err){
			res.send("true");
		});
	});
	
};
var keystone = require('keystone'),
	User = keystone.list('User'),
	Refuel = keystone.list('Refuel'),
	async = require('async');

exports = module.exports = function(req, res) {
	
	var view = new keystone.View(req, res);
	var locals = res.locals;
	
	var uId = req.body.userId;

	if (uId == "-1"){

		async.parallel([
			function (callback){
				Refuel.model.find().remove(function (err){
					if (err){
						callback(err, "error");
						console.log(err);
					}
					else {
						callback(null, "ok");
					}

				});
			},

			function (callback){
				User.model.find()
					.where("userId").nin(["000"])
					.remove(function (err){
						if (err){
							callback(err, "error");
							console.log(err);
						}
						else {
							callback(null, "ok");
						}
				});
			}
		], function (err, result){
			if (!err){
				res.send(true);
			}
		});
	}
	
};
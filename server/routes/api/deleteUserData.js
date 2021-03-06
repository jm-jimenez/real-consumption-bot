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

	else{
		async.waterfall([

			function (callback){
				User.model.find()
					.where("userId", uId)
					.populate("refuels")
					.exec()
					.then(function (result){
						var refuels = result[0].refuels;
						console.log(refuels);
						async.each(refuels, function(refuel, next){
							Refuel.model.find()
								.where("_id", refuel._id)
								.remove(function (err){
									next();
								});
						}, function (err){
							callback(null, "siguiente");
						});
					}, function (err){
						callback("stop");
				});
			},

			function (arg1, callback){
				User.model.find()
					.where("userId", uId)
					.remove(function (err){
						if (err){
							callback("stop");
						}
						else{
							callback(null, "siguiente1");
						}
					});
			}

		], function (err, result){
			res.send("true");
		});
	}
	
};
var keystone = require('keystone'),
	User = keystone.list('User');

exports = module.exports = function(req, res) {
	
	var view = new keystone.View(req, res);
	var locals = res.locals;
	
	var userId = req.body.userId;
	User.model.find()
		.where({"userId" : userId})
		.exec()
		.then(function (result){
			console.log (result.length);
			if (result.length >0){
				res.send("1");
			}
			else {
				res.send("0");
			}
		}, function (err){
			res.send("-1");
		});
	
};
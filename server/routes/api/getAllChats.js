var keystone = require('keystone'),
	User = keystone.list('User');

exports = module.exports = function(req, res) {
	
	var view = new keystone.View(req, res);
	var locals = res.locals;
	
	var userId = req.body.userId;
	User.model.find()
		.distinct("chatId", function (err, result){
			console.log(result);
			res.json(result);
		})
};
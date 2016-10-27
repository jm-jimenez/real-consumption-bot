var keystone = require('keystone');

exports = module.exports = function(req, res) {

	setTimeout(function (){
		console.log("entrooo");
		console.log(req.body);
		var view = new keystone.View(req, res);
		var locals = res.locals;
		var uid = req.body.lg_uid;

		locals.uid = uid;

		view.render("home");
	}, 3000);


};
var keystone = require('keystone'),
	User = keystone.list('User');

exports = module.exports = function(req, res) {
	
	var view = new keystone.View(req, res);
	var locals = res.locals;
	
	// locals.section is used to set the currently selected
	// item in the header navigation.
	locals.section = 'home';
	
	if (req.method == 'POST'){
		var uid = req.body.lg_uid;

		User.model.find()
			.where("userId", uid)
			.exec()
			.then(function (result){

				if (result.length > 0){
					req.flash('success', "ENCONTRADO");
				}

				else {
					req.flash('error', "Ese user id no existe");
				}

				view.render('index');

			}, function (err){
				console.log("error");
			});

	}

	else{
		view.render('index');
	}
	
};

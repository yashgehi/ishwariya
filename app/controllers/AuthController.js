const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const validator = require('validator');
const User = require('../models/User');
const Session = require('../models/Session');


exports.login = (req, res, next) => {
	const validationErrors = [];
	if (!validator.isEmail(req.body.inputEmail)) validationErrors.push('Please enter a valid email address.');
	if (validator.isEmpty(req.body.inputPassword)) validationErrors.push('Password cannot be blank.');
	if (validationErrors.length) {
		req.flash('error', validationErrors);
		return res.redirect('/login');
	}
	User.findOne({
		where: {
			email: req.body.inputEmail
		}
	}).then(user => {
		if(user) {
			bcrypt
				.compare(req.body.inputPassword, user.password)
				.then(doMatch => {
					if (doMatch) {
						req.session.isLoggedIn = true;
			            req.session.user = user.dataValues;
			            return req.session.save(err => {
							return err
			            });
					}
					return {error: 'Invalid email or password.'}
				})
				.catch(err => {
					console.log(err);
					return err
				});
		} else {
			return {error: 'No user found with this email'}
		}
	})
	.catch(err => console.log(err));
};

exports.logout = (req, res, next) => {
	if(res.locals.isAuthenticated){
		req.session.destroy(err => {
			return err;
		});
	}
};

exports.signUp = (req, res, next) => {
	User.findOne({
		where: {
			email: req.body.email
		}
	}).then(user => {
		if(!user) {
			return bcrypt
					.hash(req.body.password, 12)
					.then(hashedPassword => {
						const user = new User({
							fullName: req.body.name,
							email: req.body.email,
							password: hashedPassword,
						});
						return user.save();
					})
					.then(result => {
						return result
					});
		} else {
        	return {error: 'E-Mail exists already, please pick a different one.'}
		}
	})
	.catch(err => console.log(err));
};

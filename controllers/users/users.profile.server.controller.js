'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
	errorHandler = require('../errors.server.controller.js'),
	mongoose = require('mongoose'),
	passport = require('passport'),
	User = mongoose.model('User');

/**
 * Update user details
 */
exports.update = function(req, res) {
	// Init Variables
	var user = req.user;
	var message = null;

	// For security measurement we remove the roles from the req.body object
	delete req.body.roles;

	if (user) {
		// Merge existing user
		user = _.extend(user, req.body);
		user.updated = Date.now();
		user.displayName = user.firstName + ' ' + user.lastName;

		user.save(function(err) {
			if (err) {
				return res.status(400).send({
					message: errorHandler.getErrorMessage(err)
				});
			} else {
				req.login(user, function(err) {
					if (err) {
						res.status(400).send(err);
					} else {
						res.json(user);
					}
				});
			}
		});
	} else {
		res.status(400).send({
			message: 'User is not signed in'
		});
	}
};










exports.updatePhoto = function(req, res) {
	// Init Variables
	var user = req.user;
	var message = null;

	// For security measurement we remove the roles from the req.body object
	delete req.body.roles;

	if (user) {
		// Merge existing user
		user = _.extend(user, req.body);
		user.updated = Date.now();
		user.displayName = user.firstName + ' ' + user.lastName;

		user.save(function(err) {
			if (err) {
				return res.status(400).send({
					message: errorHandler.getErrorMessage(err)
				});
			} else {
				res.redirect('/profile');
			}
		});
	} else {
		res.status(400).send({
			message: 'User is not signed in'
		});
	}
};


exports.index = function(req, res) {
	User.find({}, function(err, users){
			res.render('./../public/views/player/user-management/all.ejs', {
			user: users || null,
			request: req
		});
	});
}

exports.delete = function(req, res) {
	User.findByIdAndRemove(req.params.userId, function(err, user){
		if(err){
			res.status(500).send(err);
		}else{
			const response = {
		        message: "User successfully deleted",
		        id: user._id
		    };
			res.status(200).send(response);
		}
	})
}


module.exports.editView = function(req, res) {
	User.findOne({ _id: req.params.userId}, function(err, userPro){
		if(err){
			res.status(500).send(err);
		}
			console.log(userPro);

		res.render('./../public/views/player/user-management/setting.ejs', {
			user: userPro,
			request: req
		});
	});
};


exports.createUser = function(req, res) {
	res.render('./../public/views/player/user-management/create.ejs', {
	   user: req.user || null,
	   request: req
	});
};


/**
 * Send User
 */
exports.me = function(req, res) {
	res.json(req.user || null);
};

/**
 * Show the current article
 */
exports.read = function(req, res) {
	res.render('./../public/views/player/user-management/view.ejs', {
		user: req.profile,
		request: req
	});
};
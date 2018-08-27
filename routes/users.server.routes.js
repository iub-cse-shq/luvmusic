'use strict';

/**
 * Module dependencies.
 */
var passport = require('passport');

module.exports = function(app) {
	// User Routes
	var users = require('./../controllers/users.server.controller');

	// Setting up the users profile api
	app.route('/create-user').get(users.requiresLogin, users.createUser);
	app.route('/users/list').get(users.index)
	app.route('/users/me').post(users.me);
	app.route('/users/accounts').delete(users.removeOAuthProvider);
	app.route('/users/:userId').get(users.read);
	app.route('/users/:userId').put(users.update);
	app.route('/users/:userId').delete(users.delete);
	app.route('/users/:userId/edit').get(users.editView);

	// Setting up the users password api
	app.route('/users/password').post(users.changePassword);
	app.route('/auth/forgot').post(users.forgot);
	app.route('/auth/reset/:token').get(users.validateResetToken);
	app.route('/auth/reset/:token').post(users.reset);

	// Setting up the users authentication api
	app.route('/auth/signup').post(users.signup);
	app.route('/auth/signin').post(users.signin);
	app.route('/auth/signout').get(users.signout);

	// Routes to user views
	app.route('/signin').get(users.signinView);
	
	// Routes to signup form
	app.route('/signup').get(users.signupView); 

	// Finish by binding the user middleware
	app.param('userId', users.userByID);
};

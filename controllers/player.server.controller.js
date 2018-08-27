var mongoose = require('mongoose');
var errorHandler = require('./errors.server.controller');
var Song = require("./../models/Song");
var _ = require('lodash');

var express = require("express");
var multer = require('multer');
var app = express();
var path = require('path');

var storage = multer.diskStorage({
	destination: function(req, file, callback) {
		callback(null, './public/uploads')
	},
	filename: function(req, file, callback) {
		// console.log(file);
		var filename = file.fieldname + '-' + Date.now() + path.extname(file.originalname);
		callback(null, filename)
		console.log(filename)
		req.user.photo = '/uploads/' + filename;
	}
})


module.exports.uploadPhoto = function(req, res, next){
  var upload = multer({
  	storage: storage,
  	fileFilter: function(req, file, callback) {
  		var ext = path.extname(file.originalname)
  		if(ext !== '.png' && ext !== '.jpg' && ext != '.JPG' && ext !== '.gif' && ext !== '.jpeg') {
  			return callback(res.end('Only images are allowed'), null)
  		}
  		callback(null, true)
  	}
  }).single('userFile')
  upload(req, res, function(err) {

  	next();
  	// res.redirect('/profile');
  	// res.end('File is uploaded')
  	
  })
  console.log(upload)
};


// browse page
module.exports.browseMusic = function(req, res) {
	res.render('./../public/views/player/browse.ejs', {
		user: req.user || null,
		request: req
	});
};

// songs list
module.exports.music = function(req, res) {
	res.render('./../public/views/player/songs.ejs', {
		user: req.user || null,
		request: req
	});
};

// setting page
module.exports.setting = function(req, res) {

	res.render('./../public/views/player/setting.ejs', {
		user: req.user || null,
		request: req
	});
	
};

// profile page
module.exports.profile = function(req, res) {
	res.render('./../public/views/player/profile.ejs', {
		user: req.user || null,
		request: req
	});
};

module.exports.faq = function(req, res) {
	res.render('./../public/views/player/faq.ejs', {
		user: req.user || null,
		request: req
	});
};
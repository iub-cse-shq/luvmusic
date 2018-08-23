var mongoose = require('mongoose');
var Dropbox = require('./../models/Dropbox.js');
var errorHandler = require('./errors.server.controller');
var _ = require('lodash');

module.exports.list = function(req, res) {
  Dropbox.find(function(err, data) {
    if (err) {
      return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
      });
    } else {
      console.log("api called");

      res.status(200).send(data);
    }
  });
};

module.exports.create = function(req, res) {
  var dropbox = new Dropbox(req.body);
  dropbox.user = req.user;
  dropbox.save(function(err, data) {
    if (err) {
        return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
        });
    } else {
      res.status(200).send(data);
    }
  });
};

module.exports.read = function(req, res) {
  res.json(req.dropbox);
};

module.exports.delete = function(req, res) {
	var dropbox = req.dropbox;
	dropbox.remove(function(err) {
		if (err) {
			return res.status(400).send();
		} else {
			res.json(dropbox);
		}
	});
};


module.exports.update = function(req, res) {
  var dropbox = req.dropbox;

  	dropbox = _.extend(dropbox, req.body);

  	dropbox.save(function(err) {
  		if (err) {
  			return res.status(400).send();
  		} else {
  			res.json(dropbox);
  		}
  	});
};

module.exports.appSetting=function(req,res){
  res.render('./../public/views/appsetting/setting.ejs',  {
    user: req.user || null,
    request: req
  });
};
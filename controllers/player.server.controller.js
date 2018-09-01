var crypto = require('crypto');
var config = require('./../dropbox_config.js');
var NodeCache = require( "node-cache" );
var rp = require('request-promise');
var mycache = new NodeCache();

var mongoose = require('mongoose');
var errorHandler = require('./errors.server.controller');
var Song = require("./../models/Song");
var Playlist = require("./../models/Playlist");
var Dropbox = require("./../models/Dropbox.js");

var express = require("express");
var multer = require('multer');
var app = express();
var path = require('path');

var errorHandler = require('./errors.server.controller');
var _ = require('lodash');

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

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

module.exports.playlist = async (req,res,next) => {
  Dropbox.find(async (err, data) => {
    if(err) {
      console.log(err);
    } else {
      let token = data[0].access_token;
      try{
        let paths = await getLinksAsync(token);
        // console.log(paths);
        // search start demo
        if(req.query.search) {
          const regex = new RegExp(escapeRegex(req.query.search), 'gi');
          // Get all campgrounds from DB
          Playlist.find({title: regex}, function(err, data){
            if(err){
              console.log(err);
            } else {
              // res.status(200).json(data);
              res.render("./../public/views/player/playlist.ejs",{
                user: req.user || null,
                request: req,
                playlists: paths,
                playlist: data,
                layout: false
              });
            }
          });
        } else {
          Playlist.find({}, function(err, data){
            if(err){
              return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
              });
            } else {
              // res.status(200).json(data);
              res.render("./../public/views/player/playlist.ejs",{
                user: req.user || null,
                request: req,
                playlists: paths,
                playlist: data
              });
            }
          });
        } 
        // search end
      } catch(error) {
        return next(new Error("Error getting files from Dropbox"));
      }
    }
  });
};     




module.exports.list = function(req, res) {
  Playlist.find(function(err, data) {
    if (err) {
      return res.status(400).send({

  				message: errorHandler.getErrorMessage(err)
  			});
    } else {
      // console.log("api called");

      res.status(200).send(data);
    }
  });
};

module.exports.create = function(req, res) {
  var playlist = new Playlist(req.body);
  playlist.user = req.user;
  playlist.save(function(err, data) {
    if (err) {
      return res.status(400).send({
  				message: errorHandler.getErrorMessage(err)
  			});
    } else {
      res.status(200).send(data);
    }
  });
};

async function getLinksAsync(token){

    //List images from the root of the app folder
    let result= await listImagePathsAsync(token,'');
  
    //Get a temporary link for each of those paths returned
    let temporaryLinkResults= await getTemporaryLinksForPathsAsync(token,result.paths);

    // console.log(temporaryLinkResults.name);

    //Construct a new array only with the link field
    var temporaryLinks = temporaryLinkResults.map(function (entry) {
      // return entry.link;
      return [entry.link, entry.metadata.name, entry.metadata.id];
    });
  
    return temporaryLinks;
}

  async function listImagePathsAsync(token,path){
  
    let options={
      url: config.DBX_API_DOMAIN + config.DBX_LIST_FOLDER_PATH, 
      headers:{"Authorization":"Bearer "+token},
      method: 'POST',
      json: true ,
      body: {"path":path}
    }
  
    try{
      //Make request to Dropbox to get list of files
      let result = await rp(options);
  
      //Filter response to images only
      let entriesFiltered= result.entries.filter(function(entry){
        return entry.path_lower.search(/\.(mp3|ogg|aac)$/i) > -1;
      });        
  
      //Get an array from the entries with only the path_lower fields
      var paths = entriesFiltered.map(function (entry) {
        return entry.path_lower;
      });
  
      //return a cursor only if there are more files in the current folder
      let response= {};
      response.paths= paths;
      if(result.hasmore) response.cursor= result.cursor;        
      return response;
  
    }catch(error){
      return next(new Error('error listing folder. '+error.message));
    }        
  } 
  
  
  //Returns an array with temporary links from an array with file paths
  function getTemporaryLinksForPathsAsync(token,paths){
  
    var promises = [];
    let options={
      url: config.DBX_API_DOMAIN + config.DBX_GET_TEMPORARY_LINK_PATH, 
      headers:{"Authorization":"Bearer "+token},
      method: 'POST',
      json: true
    }
  
    //Create a promise for each path and push it to an array of promises
    paths.forEach((path_lower)=>{
      options.body = {"path":path_lower};
      promises.push(rp(options));
      // console.log(promises.path_lower);
    });

    // for(var i=0; i < promises.length; i++) {
    // }

    //returns a promise that fullfills once all the promises in the array complete or one fails
    return Promise.all(promises);
}

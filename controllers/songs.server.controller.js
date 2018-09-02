var crypto = require('crypto');
var config = require('./../dropbox_config.js');
var NodeCache = require( "node-cache" );
var rp = require('request-promise');
var mycache = new NodeCache();

var mongoose = require('mongoose');
var Song = require('./../models/Song.js');
var Dropbox = require("./../models/Dropbox.js");
var errorHandler = require('./errors.server.controller');
var _ = require('lodash');

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

//steps 1,2,3
module.exports.home = async (req,res,next) => {
  Dropbox.find(async (err, data) => {
    if(err) {
      console.log(err);
    } else {
      console.log(data);
      let token = data[0].access_token;
      try{
        let paths = await getLinksAsync(token);
        // console.log(paths);
        // search start demo
        if(req.query.search) {
          const regex = new RegExp(escapeRegex(req.query.search), 'gi');
          // Get all campgrounds from DB
          Song.find({
              // title: regex
              $or: [ { title: regex }, { album: regex }, { artist: regex  }, { genre: regex }, { year: regex  } ]
          }, 
            function(err, data){
            if(err){
              console.log(err);
            } else {
              // res.status(200).json(data);
              res.render("./../public/views/player/songs/songs.ejs",{
                user: req.user || null,
                request: req,
                songs: paths,
                song: data,
                layout: false
              });
            }
          });
        } else {
          Song.find({}, function(err, data){
            if(err){
              return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
              });
            } else {
              // res.status(200).json(data);
              res.render("./../public/views/player/songs/songs.ejs",{
                user: req.user || null,
                request: req,
                songs: paths,
                song: data
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


module.exports.genre = function(req, res) {
	res.render('./../public/views/player/songs/genre.ejs', {
		user: req.user || null,
		request: req
	});
};

// /browse/album
module.exports.album = async (req,res,next) => {

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
          Song.find({title: regex}, function(err, data){
            if(err){
              console.log(err);
            } else {
              // res.status(200).json(data);
              res.render("./../public/views/player/songs/album.ejs",{
                user: req.user || null,
                request: req,
                songs: paths,
                song: data,
                layout: false
              });
            }
          });
        } else {
          Song.find({}, function(err, data){
            if(err){
              return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
              });
            } else {
              // res.status(200).json(data);
              res.render("./../public/views/player/songs/album.ejs",{
                user: req.user || null,
                request: req,
                songs: paths,
                song: data
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


module.exports.dropboxauth = (req, res, next) => {
    let state = crypto.randomBytes(16).toString('hex');
     
    //Save state and temporarysession for 10 mins
    mycache.set(state, "aTempSessionValue", 600);
     
    let dbxRedirect= config.DBX_OAUTH_DOMAIN 
            + config.DBX_OAUTH_PATH 
            + "?response_type=code&client_id="+config.DBX_APP_KEY
            + "&redirect_uri="+config.OAUTH_REDIRECT_URL 
            + "&state="+state;
    
    res.redirect(dbxRedirect);
};

//steps 8-12
module.exports.oauthredirect = async (req,res,next)=>{

  if(req.query.error_description){
    return next( new Error(req.query.error_description));
  } 

  let state= req.query.state;
  if(!mycache.get(state)){
    return next(new Error("session expired or invalid state"));
  } 

  //Exchange code for token
  if(req.query.code ){
  
    let options={
      url: config.DBX_API_DOMAIN + config.DBX_TOKEN_PATH, 
          //build query string
      qs: {'code': req.query.code, 
      'grant_type': 'authorization_code', 
      'client_id': config.DBX_APP_KEY, 
      'client_secret':config.DBX_APP_SECRET,
      'redirect_uri':config.OAUTH_REDIRECT_URL}, 
      method: 'POST',
      json: true }

    try{

      let response = await rp(options);

      //we will replace later cache with a proper storage
      mycache.set("aTempTokenKey", response.access_token, 3600);
      res.redirect("/browse/songs");

    }catch(error){
      return next(new Error('error getting token. '+error.message));
    }        
  }
};

/*Gets temporary links for a set of files in the root folder of the app
It is a two step process:
1.  Get a list of all the paths of files in the folder
2.  Fetch a temporary link for each file in the folder */
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
  
  
  /*
  Returns an object containing an array with the path_lower of each 
  image file and if more files a cursor to continue */
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

// edit page
module.exports.edit = (req, res) => {
  Dropbox.findOne(function(err, data) {
      if (err) {
        console.log(err);
      } else {
        res.render('./../public/views/player/songs/edit.ejs', {
          user: req.user || null,
          request: req,
          dropbox: data,
          layout: false
        });
      }
  });
};

// details page
module.exports.details = function(req, res) {
	res.render('./../public/views/player/songs/details.ejs', {
		user: req.user || null,
		request: req
	});
};

module.exports.list = function(req, res) {
  Song.find(function(err, data) {
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
  var song = new Song(req.body);
  song.user = req.user;
  song.save(function(err, data) {
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
  res.json(req.Song);
};


exports.delete = function(req, res) {
	var song = req.song;
	song.remove(function(err) {
		if (err) {
			return res.status(400).send();
		} else {
			res.json(song);
		}
	});
};


module.exports.update = function(req, res) {
  var song = req.song;
  song = _.extend(song, req.body);
  song.save(function(err) {
  		if (err) {
  			return res.status(400).send();
  		} else {
  			res.json(song);
  		}
  });
};

exports.songByID = function(req, res, next, id) {
	Song.findById(id).populate('user', 'email').exec(function(err, song) {
		if (err) return next(err);
		if (!song) return next(new Error('Failed to load music ' + id));
	
		req.song = song;
		next();
	});
};

module.exports.listView = function(req, res) {
    Song.find(function(err, data) {
      if (err) {
        return res.status(400).send({

          message: errorHandler.getErrorMessage(err)
        });
      }
      else {
        console.log("api called");

        res.render('./../public/views/player/all.ejs', {
          user: req.user || null,
          request: req,
          songs: data
        });
      }
    });
};
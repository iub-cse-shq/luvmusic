module.exports = function(app) {
    var songs = require('./../controllers/songs.server.controller.js');
    var users = require('./../controllers/users.server.controller.js');
    
    app.route('/api/songs')
       .get(songs.list)
       .post(users.requiresLogin, songs.create);
    
    app.route('/api/songs/:songId')
    .get(songs.read)
    .delete(users.requiresLogin, songs.delete);
    
    app.route('/api/songs/edit/:songId')
    .get(songs.read)
    .put(users.requiresLogin, songs.update);
    
    app.route('/edit').get(users.requiresLogin, songs.edit);
    app.route('/details/:songId').get(users.requiresLogin, songs.details);  //  /details
    app.route('/browse/songs').get(users.requiresLogin, songs.home);        //  /browse/songs
    app.route('/browse/genre').get(users.requiresLogin, songs.genre);
    app.route('/browse/albums').get(users.requiresLogin, songs.album);        //  /browse/songs
    
    app.param('songId', songs.songByID);
}
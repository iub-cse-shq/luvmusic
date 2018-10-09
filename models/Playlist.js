var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PlaylistSchema = {

    name: {
        type: String,
        default: 'Untitled',
        trim: true
    },
    
    user_id: {
      type: String,
      default: true,
      required: true
    },
    
    song_id: {
        type: String,
        trim: true,
        required: true
    }
}

var Playlist = mongoose.model('Playlist', PlaylistSchema, 'playlists');
module.exports = Playlist;
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PlaylistSchema = {

    title: {
        type: String,
        default: 'Unknown',
        trim: true
    },

    artist: {
        type: String,
        default: 'Unknown',
        trim: true
    },

    year: {
        type: String,
        default: 'Unknown',
    },

    genre: {
        type: String,
        default: 'Unknown',
        trim: true
    },

    album: {
        type: String,
        default: 'Unknown',
        trim: true
    },

    src: {
        type: String,
        trim: true,
        required: 'Please select a valid music file!'
    }
};

var Playlist = mongoose.model('Playlist', PlaylistSchema, 'playlists');
module.exports = Playlist;
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var DropboxSchema = {

    access_token: {
        unique:true,
        type: String,
        required: 'Token required',
        // trim: true
    }
};

var Dropbox = mongoose.model('Dropbox', DropboxSchema, 'dropbox');
module.exports = Dropbox;
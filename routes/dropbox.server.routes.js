// 'use strict';
 // module.exports = function(app) {
 // 	// Root routing
// 	var dropbox = require('./../controllers/dropbox.server.controller.js');
//     var users = require('./../controllers/users.server.controller.js');
 //     app.route('/api/appsetting')
//         .get(dropbox.list)
//         .post(/*users.requiresLogin,*/ dropbox.create);
 //     app.route('/api/appsetting/:appId')
//         .get(dropbox.read)
//         .delete(users.requiresLogin, dropbox.delete);
 //     app.route('/api/appsetting/edit/:appId')
//         .get(dropbox.read)
//         .put(users.requiresLogin, dropbox.update);
    
//     app.route('/admin/appsetting').get(users.requiresLogin, dropbox.appSetting);
    
// };
 'use strict';
 module.exports = function(app) {
 	var dropboxs = require('./../controllers/dropbox.server.controller.js');
    var users = require('./../controllers/users.server.controller.js');
     app.route('/api/appsetting')
        .get(dropboxs.list)
        .post(/*users.requiresLogin,*/ dropboxs.create);
     app.route('/api/dropboxs/:dropboxId')
        .get(dropboxs.read)
        .delete(users.requiresLogin, dropboxs.delete);
     app.route('/api/dropboxs/edit/:dropboxId')
        .get(dropboxs.read)
        .put(users.requiresLogin, dropboxs.update);
     app.route('/admin/appsetting').get(users.requiresLogin, dropboxs.appSetting);
};
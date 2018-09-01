'use strict';

module.exports = function(app) {

	// Root routing
	var core = require('./../controllers/core.server.controller');
	var contacts = require('./../controllers/contacts.server.controller.js');
    var users = require('./../controllers/users.server.controller.js');


    app.route('/api/contacts')
        .get(contacts.list)
        .post(/*users.requiresLogin,*/ contacts.create);

    app.route('/api/contacts/:contactId')
        .get(contacts.read)
        .delete(users.requiresLogin, contacts.delete);

    app.route('/api/contacts/edit/:contactId')
        .get(contacts.read)
        .put(users.requiresLogin, contacts.update);


	app.route('/').get(core.index);
	app.route('/about').get(core.about);
	app.route('/contact').get(core.contact);
	app.route('/faq').get(core.faq);
    
    app.route('/admin/contacts').get(users.requiresLogin, contacts.listView);
    app.route('/admin/contact/:contactId').get(users.requiresLogin, contacts.singleView);
    // app.route('/admin/contact/view').get(contacts.singleView);

    app.param('contactId', contacts.contactByID);
};

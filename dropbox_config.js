require('dotenv').config({silent: true});

/**
 * Load Dropbox API
 */
module.exports = {
	DBX_API_DOMAIN: 'https://api.dropboxapi.com',
	DBX_OAUTH_DOMAIN: 'https://www.dropbox.com',
	DBX_OAUTH_PATH: '/oauth2/authorize',
	DBX_TOKEN_PATH: '/oauth2/token',
	DBX_APP_KEY: 'feneiiuakfwlq4m',
	DBX_APP_SECRET: 'tilpw3okapuskga', 
	// OAUTH_REDIRECT_URL:"http://localhost:3000/oauthredirect",
	OAUTH_REDIRECT_URL:"https://luvmusic-group15-shamahoque.c9users.io/oauthredirect",
	DBX_LIST_FOLDER_PATH:'/2/files/list_folder',
	DBX_LIST_FOLDER_CONTINUE_PATH:'/2/files/list_folder/continue',
	DBX_GET_TEMPORARY_LINK_PATH:'/2/files/get_temporary_link',

	// file upload
	DBX_CONTENT_DOMAIN: 'https://content.dropboxapi.com',
	DBX_UPLOAD_PATH: '/2/files/upload'
}

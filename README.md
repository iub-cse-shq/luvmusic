Luv Music
=========

## Makes Your life magical

![Luv Music](https://github.com/ovijit16/images/blob/master/luv%20screenshot/luvmusic%20logo.jpg?raw=true)


***Description:***
Luv Music is a website for a music lover who wants to test difference type of music in a single platform.

Features
--------

1. ***Selection of Different Genre Songs***

    Users can play many kind of songs according to their taste.

***sample of options***

![Browse](https://github.com/ovijit16/images/blob/master/luv%20screenshot/userinterface.png?raw=true)


--------


2. ***Music List***

    All the songs will be display in a nice listed format. User can easily browse the songs and play at their will.


**Sample**

![Songs List](https://github.com/ovijit16/images/blob/master/luv%20screenshot/songs%20-%20Copy.png?raw=true)

3. ***Music Details***
  A user can see music details by clicking hamburger icon at the right side of every music.

![details](https://github.com/ovijit16/images/blob/master/luv%20screenshot/songsdetails.png?raw=true)-


4. ***search***
  A user can search their favorite song through search bar by songs title.

![search](https://github.com/ovijit16/images/blob/master/luv%20screenshot/search.jpg?raw=true)



5. ***Feature Audio Player***
User can enjoy the songs through our user-friendly audio player.
![Audio Player](https://github.com/ovijit16/images/blob/master/luv%20screenshot/luvplayer.png?raw=true)

6. ***User-Admin Communication***
A user can communicate with admin at any time and give their, ask question through our contact page.
![Contaact](https://github.com/ovijit16/images/blob/master/luv%20screenshot/Contact.png?raw=true)

7. ***Edit Profile***
A user can edit their profile information any time and upload their profile picture as their wish.
![DP](https://github.com/ovijit16/images/blob/master/luv%20screenshot/Account%20Setting.png?raw=true)


--------

Download
--------

 ***Download***
 User also can download the song.

![download](https://github.com/ovijit16/images/blob/master/luv%20screenshot/download.png?raw=true)


Admin Features

1. ***Add Song***
Only admin can upload the songs with songs details.

![add song](https://github.com/ovijit16/images/blob/master/luv%20screenshot/AddSong.png?raw=true)


2. ***Read user message/feedback***
Admin can read user feedback/message.

![message](https://github.com/ovijit16/images/blob/master/luv%20screenshot/messages.png?raw=true)

****************************************************************

**How to set up the code**

1. Install [Node.js](https://nodejs.org/en/download/) and [MongoDB](https://www.mongodb.com/download-center?jmp=nav) on your computer

2. Download this code, and from command prompt run:

   `npm install`


   `bower install`


3. To run the code, run:

    `node server.js`


4. In the browser open http://localhost:3000/, and you should see the index page

**Exposed APIs**:

GET **/api/articles** (returns list of articles)

POST **/api/articles** (create new article)

GET **/api/articles/:articleId** (returns an article with matching id)

DELETE **/api/articles/:articleId** (deletes the matching article)

GET **/api/articles/edit/:articleId** (returns an article with matching id)

PUT **/api/articles/edit/:articleId** (updates the matching article)

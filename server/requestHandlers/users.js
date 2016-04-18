var Users = require('../db/UsersController.js');
var Games = require('../db/GamesController.js');
var UsersGames = require('../db/UsersGamesController.js');
var Friends = require('../db/FriendsController.js');
var Steam = require('../db/SteamController.js');
var fb = require('../apis/fbController.js');
var jwt = require('jwt-simple');

module.exports = {
  getProfile: function(req, res, next) {
    // console.log(req.session.userJwtToken);
    var user = jwt.decode(req.session.userJwtToken, 'secret');
    Users.getOneUser(user, function(err, profile) {
      if (err) {
        res.status(500).send(err);
      } else {
        res.status(200).send(profile);
      }
    });
  },
  getFriends: function(req, res, next) {
    var user = jwt.decode(req.session.userJwtToken, 'secret');
    Friends.getAllFriends(user, function(err, friends) {
      if (err) {
        res.status(500).send(err);
      } else {
        res.status(200).send(friends);
      }
    });
  },
  addFriend: function(req, res, next) {
    var user1 = req.body.user1;
    var user2 = req.body.user2;
    console.log('REQUEST BODY!!!!!', req.body); 
    Friends.newFriend(user1, user2, function(err, friend) {
      if (err) {
        console.log(err);
        res.status(500).send(err);
      } else {
        res.status(201).send(friend);
      }
    });
  },
  updateProfile: function(req, res, next) {
    // var user = jwt.decode(req.session.userJwtToken, 'secret');
    console.log(req.body);
    Users.updateProfile(req.body, function(err, response) {
      if (err) {
        res.status(500).send(err);
      } else {
        res.status(200).send();
      }
    });
  },
  updateSteamProfile: function(req, res, next) {
    // var user = jwt.decode(req.session.userJwtToken, 'secret');
    console.log(req.body);
    Steam.addSteam(req.body, function(err, response) {
      if (err) {
        res.status(500).send(err);
      } else {
        res.status(200).send();
      }
    });
  },
  getSteamProfile: function(req, res, next) {
    // var user = jwt.decode(req.session.userJwtToken, 'secret');
    console.log('REQUEST BODY IS', req.query);
    Steam.getSteam(req.query, function(err, response) {
      if (err) {
        res.status(204).send('user not found');
      } else {
        res.status(200).send(response);
      }
    });
  },
  getSteamGame: function(req, res, next) {
    // var user = jwt.decode(req.session.userJwtToken, 'secret');
    console.log('REQUEST BODY IS', req.query);
    Steam.getSteam(req.query, function(err, response) {
      if (err) {
        res.status(204).send('user not found');
      } else {
        res.status(200).send(response);
      }
    });
  },

  //INTERACTS WITH OUR GAMES TABLE IN DB
  addSteamGame: function(req, res, next) {
    Games.addGame(req.body, function(err, response) {
      if (err) {
        res.status(204).send('user not found');
      } else {
        res.status(200).send(response);
      }
    });
  },

  //INTERACTS WITH OUR USERGAMES TABES IN DB
  getUserGameRelation: function(req, res, next) {
    console.log('REQUEST QUERY', req.query);
    // UsersGames.getUsersGames(req.query, function(err, response) {
    //   if (err) {
    //     res.status(204).send('user not found');
    //   } else {
    //     res.status(200).send(response);
    //   }
    // });
  },
  addUserGameRelation: function(req, res, next) {
    var user = req.body.user;
    var game = req.body.game;
    console.log('------------------USER INfO!!!!------------');
    console.log(user.id);
    console.log(game.steam_appid);
    UsersGames.addUserGame(user, game, function(err, response) {
      if (err) {
        res.status(204).send('user not found');
      } else {
        res.status(200).send(response);
      }
    });
  },

  signout: function(req, res, next) {
    req.session.destroy();
    res.redirect('/');
    res.end();
  },
  findFBFriends: function(req, res, next) {
    var user = jwt.decode(req.session.userJwtToken, 'secret');
    fb.getFacebookFriends(req.session, function(err, results) {
      if (err) {
        console.log('findFBFriends error ---- ', err);
        res.status(500).send();
      } else {
        res.status(202).send();
        if (results) {
          results.forEach(function(item, index, array) {
            Users.getOneUser({fbID: item.id}, function(err, ifUser) {
              if (err) {console.log(err)} else {
                if (ifUser) {
                  Friends.newFriend(user, ifUser, function(err, added) {
                    if (err) {console.log(err)} else {console.log(added)};
                  });
                }
              }
            });
          });
        }
      }
    });
  }
};

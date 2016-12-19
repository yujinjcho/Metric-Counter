var config = process.env.PRODUCTION === 'true' ?
  require('./config') :
  require('./localConfig');

var assert = require('assert');

var MongoClient = require('mongodb').MongoClient;
var passport = require('passport');
var Strategy = require('passport-facebook').Strategy;

var express = require('express');
var bodyParser = require('body-parser');
var session = require('express-session');
var pushups = require('./app_modules/pushups');
var dataManager = require('./app_modules/dataManager');

var app = express();
var db;

app.set('views', './views');
app.set('view engine', 'pug');

passport.use(
  new Strategy({
    clientID: config.fbAppId,
    clientSecret: config.fbSecret,
    callbackURL: '/login/return'},
    function(accessToken, refreshToken, profile, cb) {
      return cb(null, profile);
    }
  )
);

passport.serializeUser(function(user, cb) {
  cb(null, user);
});
passport.deserializeUser(function(obj, cb) {
  cb(null, obj);
});

app.use(session({
  secret: config.expressSecret,
  resave: false,
  saveUninitialized: true,
  cookie: {secure: false}
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static('dist'));
app.use(bodyParser.json());

app.get('/api/data', function(req, res) {
  dataManager.loadData(req, res, db);
});

app.get('/leaderboard', function(req, res) {
  res.render('leaderboard');
});

app.get('/api/leaderboard', function(req, res) {
  db.collection(config.mongoUsers).aggregate([
      {$group: {
        _id: {
          userId: '$userId',
          name: '$name'
        }
      }}
    ], function(err, data) {
      pushups.leaderboardData(db, res, data);
    }
  );
});

app.get('/api/categories', function(req, res) {
  dataManager.loadCategories(req, res, db);
});

app.post('/api/categories/:category', function(req, res) {
  dataManager.createCategory(req, res, db);
});

app.delete('/api/categories/:category', function(req, res) {
  dataManager.deleteCategory(req, res, db);
});

app.post('/api/add', function(req, res) {
  dataManager.addEntry(req, res, db);
});

app.get('/login', passport.authenticate('facebook'));

app.get('/logout', function(req, res) {
  req.session.destroy(function(err) {
    res.redirect('/');
  });
});

app.get(
  '/login/return',
  passport.authenticate('facebook', {session: true, failureRedirect: '/'}),
  function(req, res) {
    dataManager.handleUser(req.user, res, db);
  }
);

MongoClient.connect(config.mongoDev, function(err, dbConnection) {
  db = dbConnection;
  var server = app.listen(config.port, function() {
    var port = server.address().port;
    console.log('Started server at port:', port);
  });
});

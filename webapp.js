const config = process.env.PRODUCTION === 'true' ?
  require('./config') :
  require('./localConfig');

const assert = require('assert');

const MongoClient = require('mongodb').MongoClient;
const passport = require('passport');
const Strategy = require('passport-facebook').Strategy;

const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const pushups = require('./app_modules/pushups');
const dataManager = require('./app_modules/dataManager');

const app = express();
var db;

app.set('views', './views');
app.set('view engine', 'pug');

passport.use(
  new Strategy({
    clientID: config.fbAppId,
    clientSecret: config.fbSecret,
    callbackURL: '/login/return'},
    (accessToken, refreshToken, profile, cb) => cb(null, profile)
  )
);

passport.serializeUser((user, cb) => cb(null, user));
passport.serializeUser((user, cb) => cb(null, user));
passport.deserializeUser((obj, cb) => cb(null, obj));

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

app.get('/api/data', (req, res) => dataManager.loadData(req, res, db));

app.get('/leaderboard', (req, res) => res.render('leaderboard'));

app.get('/api/leaderboard', (req, res) => {
  db.collection(config.mongoUsers).aggregate(
    [{$group: {
      _id: {
        userId: '$userId',
        name: '$name'
      }
    }}],
    (err, data) => pushups.leaderboardData(db, res, data)
  );
});

app.get('/api/categories', (req, res) => dataManager.loadCategories(req, res, db));

app.post(
  '/api/categories/:category',
  (req, res) => dataManager.createCategory(req, res, db)
);

app.delete(
  '/api/categories/:category',
  (req, res) => dataManager.deleteCategory(req, res, db)
);

app.post(
  '/api/add',
  (req, res) => dataManager.addEntry(req, res, db)
);

app.get('/login', passport.authenticate('facebook'));

app.get(
  '/logout',
  (req, res) => {req.session.destroy((err) => { res.redirect('/') })}
);

app.get(
  '/login/return',
  passport.authenticate('facebook', {session: true, failureRedirect: '/'}),
  (req, res) => dataManager.handleUser(req.user, res, db)
);

MongoClient.connect(config.mongoDev, (err, dbConnection) => {
  db = dbConnection;
  let server = app.listen(config.port, () => {
    let port = server.address().port;
    console.log('Started server at port:', port);
  });
});

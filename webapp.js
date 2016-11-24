var config = process.env.PRODUCTION === 'true' ? require('./config') : require('./localConfig');

var assert = require('assert');

var MongoClient = require('mongodb').MongoClient;
var passport = require('passport')
var Strategy = require('passport-facebook').Strategy;

var express = require('express');
var bodyParser = require('body-parser');
var session = require('express-session');
var pushups = require('./pushups');
var dataManager = require('./dataManager');

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
  db.collection(config.mongoUsers).aggregate([
      {$group: {
        _id: {
          userId: '$userId',
          name: '$name'
        }
      }}
    ], function(err, data) {
      pushups.renderLeaderboard(db, res, data);
    }
  );
})

app.get('/api/categories', function(req, res) {
  loadCategories(req, res);
});

function loadCategories(req, res) {
  if (req.user === undefined) {
    var defaultCategory = {
      categoriesByUpdate: [{_id: 'General', recent: new Date()}],
      categoriesByCreated: []
    };
    res.json(defaultCategory);
  } else {
    recentCategories(req, res);
  };
};

app.post('/api/categories/:category', function(req, res) {
  createCategory(req, res);
});

function createCategory(req, res) {
  if (req.user !== undefined) {
    createCategoryInDB(res, req.user.id, req.params.category)
  } else {
    res.send('Must be logged in');
  }
};

app.delete('/api/categories/:category', function(req, res) {
  deleteCategory(req, res);
})

function deleteCategory(req, res) {
  if (req.user !== undefined ) {
    deleteCategoryInDB(res, req.user.id, req.params.category);
  } else {
    res.send('Must be logged in');
  };
}

app.post('/api/add', function(req, res) {
  dataManager.addEntry(req, res, db);
});

app.get('/login', passport.authenticate('facebook'));

app.get('/logout', function(req, res) {
  req.session.destroy(function(err) {
    res.redirect('/');
  })
})

app.get(
  '/login/return',
  passport.authenticate('facebook', { session: true, failureRedirect: '/' }),
  function(req, res) {
    handleUser(req.user, res);
  }
);

function createCategoryInDB(res, userId, category) {
  db.collection(config.mongoCategories).insert({
    userId: userId,
    category: category,
    date: new Date()
  }, function(err, doc) {
    res.send('Created successfully!');
  });
}

function deleteCategoryInDB(res, userId, category) {
  db.collection(config.mongoCategories).remove({
    userId: userId,
    category: category
  }, function(err, result) {
    assert.equal(err, null);
    deleteCategoryMetrics(res, userId, category);
  });
};

function deleteCategoryMetrics(res, userId, category) {
  db.collection(config.mongoCollection).remove({
    userId: userId,
    category: category
  }, function(err, result) {
    assert.equal(err, null);
    res.send('Delete Successful');
  })
};

function recentCategories(req, res) {
  db.collection(config.mongoCollection).aggregate([
    {$match: {'userId': req.user.id}},
    {$sort: {date:1}},
    {$group: {
      _id: '$category',
      recent: {$last: '$date'}
    }}
  ], function(err, data) {
    assert.equal(null, err);
    userCategories(req, res, data);
  });
};

function userCategories(req, res, categoriesLastUpdated) {
  db.collection(config.mongoCategories).find({userId: req.user.id}).toArray(function(err, doc) {
    var result = {
      categoriesByCreated: doc,
      categoriesByUpdate: categoriesLastUpdated
    };
    res.json(result);
  })
};

function handleUser(user, res) {
  db.collection(config.mongoUsers).findOne({'userId': user.id}, function(err, doc) {
    if (doc === null) {
      console.log('Creating User');
      createUser(user, res);
    } else {
      console.log('User found');
      res.redirect('/');
    }
  });
};

function createUser(user, res) {
  var userInfo = {
    date: new Date(),
    userId: user.id,
    name: user.displayName
  };
  db.collection(config.mongoUsers).insert(userInfo, function(err, doc) {
    createDefaultCategory(user.id, res);
  });
};

function createDefaultCategory(userId, res) {
  db.collection(config.mongoCategories).insert({
    userId: userId,
    category: 'General',
    date: new Date()
  }, function(err, doc) {
    res.redirect('/');
  });
};

MongoClient.connect(config.mongoDev, function(err, dbConnection) {
  db = dbConnection;
  var server = app.listen(config.port, function() {
    var port = server.address().port;
    console.log('Started server at port:', port);
  });
});

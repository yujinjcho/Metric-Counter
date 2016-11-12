if (process.env.PRODUCTION === 'true') {
  var config = require('./config');
} else {
  var config = require('./localConfig');
};

var express = require('express');
var app = express();
var assert = require('assert');
var moment = require('moment');
var MongoClient = require('mongodb').MongoClient;
var bodyParser = require('body-parser');
var db;
var passport = require('passport')
var Strategy = require('passport-facebook').Strategy;
var session = require('express-session');

var PUSHUPS_GOAL = 5000;

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
  var start = startDate();
  if (req.user === undefined) {
    guestData(res, start);
  } else {
    getDailyandTotalData(start, res, req.user.id, req.query.category);
  }
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
      totalPushups(res, data);
    }
  );
})

function totalPushups(res, userData) {
  var userIdNameMapping = userData.reduce(function(acc, item) {
    return Object.assign(acc, { [item._id.userId]: item._id.name });
  }, {});


  db.collection(config.mongoCollection).aggregate([
    {$match: {
      $or: [
        {'category': 'pushups'},
        {'category': 'Pushups'},
      ]
    }},
    {$group: {
      _id: {
        category:'$category',
        userId: '$userId'
      },
      count: {$sum: '$amount'},
      startDate: { $min: '$date' }
    }}
  ], function(err, data) {
    assert.equal(null, err);

    var today = moment(new Date());

    var statsByUser = data.reduce(function(acc, item) {
      var days = today.diff(moment(item.startDate), 'days') + 1;
      var dailyAverage = Math.round(item.count / days * 10) / 10;
      var projectedDaysLeft = Math.round((PUSHUPS_GOAL - item.count) / dailyAverage);

      return Object.assign(
        acc,
        {
          [item._id.userId]: {
            count: item.count,
            days: days,
            dailyAverage: dailyAverage,
            progress: Math.round(item.count / PUSHUPS_GOAL * 100) + '%',
            projectedDaysLeft: projectedDaysLeft
          }
        }
      );
    }, {})

    var results = Object.keys(userIdNameMapping).map(function(userId) {
      return Object.assign(
        {},
        { name: userIdNameMapping[userId] },
        statsByUser[userId]
      );
    });

    var output = results
      .filter(function(user) { return Number.isInteger(user.count) })
      .sort(function(a, b) { return b.count - a.count });

    res.json(output);
  });
};

app.get('/api/categories', function(req, res) {
  if (req.user === undefined) {
    var defaultCategory = {
      categoriesByUpdate: [{_id: 'General', recent: new Date()}],
      categoriesByCreated: []
    };
    res.json(defaultCategory);
  } else {
    recentCategories(req, res);
  };
});

app.post('/api/categories/:category', function(req, res) {
  if (req.user !== undefined) {
    createCategory(res, req.user.id, req.params.category)
  } else {
    res.send('Must be logged in');
  }
})

app.delete('/api/categories/:category', function(req, res) {
  if (req.user !== undefined ) {
    deleteCategory(res, req.user.id, req.params.category);
  } else {
    res.send('Must be logged in');
  };
})

app.post('/api/add', function(req, res) {
  var timeStamp = new Date();
  var newEntry = {
    date: timeStamp,
    monthDay: (timeStamp.getMonth() + 1) + '-' + timeStamp.getDate(),
    userId: req.body.userId,
    category: req.body.category,
    amount: req.body.amount
  };
  console.log(timeStamp);
  console.log((timeStamp.getMonth() + 1) + '-' + timeStamp.getDate());

  db.collection(config.mongoCollection).insert(newEntry, function(err, doc) {
    assert.equal(null, err);
    console.log('Entry has been added');
    getDailyandTotalData(startDate(), res, req.body.userId, req.body.category);
  });
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

function createCategory(res, userId, category) {
  db.collection(config.mongoCategories).insert({
    userId: userId,
    category: category,
    date: new Date()
  }, function(err, doc) {
    res.send('Created successfully!');
  });
}

function deleteCategory(res, userId, category) {
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

function startDate() {
  return new Date(moment().subtract(6, 'days')
    .startOf('day').toISOString());
};

function guestData(res, start) {
  var dateLabels = getDatesLabelInput();
  var dailyData = ['daily', 0, 0, 0, 0, 0, 0];
  var cumulativeData = ['daily', 0, 0, 0, 0, 0, 0];
  res.json({
    dateLabels: dateLabels,
    dailyData: dailyData,
    cumulativeData: cumulativeData,
    user: null
  });
};

function getDailyandTotalData(date, res, userId, category) {
  db.collection(config.mongoCollection).aggregate([
    {$match: {
      $and: [
        {'date': {$gte: date}},
        {'userId': userId},
        {'category': category}
      ]
    }},
    {$group: {
      _id: '$monthDay',
      count: {$sum: '$amount'}
    }}
  ], function(err, data) {
    assert.equal(null, err);
    getTotalBefore(date, data, res, userId, category);
  });
};

function getTotalBefore(date, dailyData, res, userId, category) {
  db.collection(config.mongoCollection).aggregate([
    {$match: {
      $and: [
        {'date': {$lt: date}},
        {'userId': userId},
        {'category': category}
      ]
    }},
    {$group: {
      _id: null,
      count: {$sum: '$amount'}
    }}
  ], function(err, data) {
    assert.equal(null, err);
    var result = formatData(data, dailyData, userId);
    res.json(result);
  });
};

function formatData(remaining, lastSevenDays, userId) {
  var dateLabels = getDatesLabelInput();
  var dailyData = formatDailyInput(lastSevenDays, dateLabels);
  var cumulativeData = formatCumulativeInput(dailyData, remaining);
  return {
    dateLabels: dateLabels,
    dailyData: dailyData,
    cumulativeData: cumulativeData,
    user: userId
  };
};

function getDatesLabelInput() {
  var dates = [];
  var dateObj = new Date();

  for (i = 0; i < 6; i++) {
    var month = dateObj.getMonth() + 1;
    var date = dateObj.getDate() ;
    var label =  month + '-' + date;
    dates.unshift(label);
    dateObj.setDate(dateObj.getDate() - 1);
  };

  return ['x'].concat(dates);
};

function formatDailyInput(aggregatedDailyData, datesInput) {
  var dataDict = aggregatedDailyData.reduce(
    function(d, item) {
      d[item._id] = item.count;
      return d;
    }, {}
  );

  return ['daily'].concat(datesInput.slice(1).map(function(date) {
    return dataDict[date] || 0;
  }));
};

function formatCumulativeInput(daily, remaining) {
  var remainingCount = remaining[0] ? remaining[0].count : 0;
  var countsCopy = daily.slice();

  for (var i = 2; i < countsCopy.length; i++) {
    countsCopy[i] = countsCopy[i] + countsCopy[i - 1];
  };

  var cumulativeCounts = countsCopy.map(function(item) {
    if (item === 'daily') {
      return 'daily';
    } else {
      return item + remainingCount;
    }
  });

  return cumulativeCounts;
};

MongoClient.connect(config.mongoDev, function(err, dbConnection) {
  db = dbConnection;
  var server = app.listen(config.port, function() {
    var port = server.address().port;
    console.log('Started server at port:', port);
  });
});

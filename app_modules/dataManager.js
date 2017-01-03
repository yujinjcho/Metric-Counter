var config = process.env.PRODUCTION === 'true' ?
  require('../config') :
  require('../localConfig');

var assert = require('assert');
var moment = require('moment');
var c3Helper = require('./c3Helper');

function loadData(req, res, db) {
  var start = startDate();
  if (req.user === undefined) {
    guestData(res, start);
  } else {
    getDailyandTotalData(start, res, req.user.id, req.query.category, db);
  }
};

function addEntry(req, res, db) {
  var timeStamp = new Date();
  var newEntry = {
    date: timeStamp,
    monthDay: (timeStamp.getMonth() + 1) + '-' + timeStamp.getDate(),
    userId: req.body.userId,
    category: req.body.category,
    amount: req.body.amount
  };

  db.collection(config.mongoCollection).insert(newEntry, function(err, doc) {
    assert.equal(null, err);
    console.log('Entry has been added');
    getDailyandTotalData(
      startDate(),
      res,
      req.body.userId,
      req.body.category,
      db
    );
  });
}

function getDailyandTotalData(date, res, userId, category, db) {
  db.collection(config.mongoCollection).aggregate([
    {$match: {
      $and: [
        {'date': {$gte: date}},
        {'userId': userId},
        {'category': category}
      ]
    }},
    {$group: {
      _id: {
        "monthDay": "$monthDay",
        "year": {$year: "$date"}
      },
      count: {$sum: '$amount'}
    }}
  ], function(err, data) {
    assert.equal(null, err);
    getTotalBefore(date, data, res, userId, category, db);
  });
};

function getTotalBefore(date, dailyData, res, userId, category, db) {
  db.collection(config.mongoCollection).aggregate([
    {$match: {
      $and: [
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
    var result = c3Helper.format(data, dailyData, userId);
    res.json(result);
  });
};

function guestData(res, start) {
  var dateLabels = c3Helper.createDateLabels();
  var dailyData = ['daily', 0, 0, 0, 0, 0, 0];
  var cumulativeData = ['daily', 0, 0, 0, 0, 0, 0];
  res.json({
    dateLabels: dateLabels,
    dailyData: dailyData,
    cumulativeData: cumulativeData,
    user: null
  });
};

function loadCategories(req, res, db) {
  if (req.user === undefined) {
    var defaultCategory = {
      categoriesByUpdate: [{_id: 'General', recent: new Date()}],
      categoriesByCreated: []
    };
    res.json(defaultCategory);
  } else {
    recentCategories(req, res, db);
  };
};

function recentCategories(req, res, db) {
  db.collection(config.mongoCollection).aggregate([
    {$match: {'userId': req.user.id}},
    {$sort: {date: 1}},
    {$group: {
      _id: '$category',
      recent: {$last: '$date'}
    }}
  ], function(err, data) {
    assert.equal(null, err);
    userCategories(req, res, data, db);
  });
};

function userCategories(req, res, categoriesLastUpdated, db) {
  db.collection(config.mongoCategories).find(
    {userId: req.user.id}).toArray(function(err, doc) {
      var result = {
        categoriesByCreated: doc,
        categoriesByUpdate: categoriesLastUpdated
      };
      res.json(result);
    }
  );
};

function createCategory(req, res, db) {
  if (req.user !== undefined) {
    createCategoryInDB(res, req.user.id, req.params.category, db);
  } else {
    res.send('Must be logged in');
  }
};

function deleteCategory(req, res, db) {
  if (req.user !== undefined) {
    deleteCategoryInDB(res, req.user.id, req.params.category, db);
  } else {
    res.send('Must be logged in');
  };
}

function createCategoryInDB(res, userId, category, db) {
  db.collection(config.mongoCategories).insert({
    userId: userId,
    category: category,
    date: new Date()
  }, function(err, doc) {
    res.send('Created successfully!');
  });
}

function deleteCategoryInDB(res, userId, category, db) {
  db.collection(config.mongoCategories).remove({
    userId: userId,
    category: category
  }, function(err, result) {
    assert.equal(err, null);
    deleteCategoryMetrics(res, userId, category, db);
  });
};

function deleteCategoryMetrics(res, userId, category, db) {
  db.collection(config.mongoCollection).remove({
    userId: userId,
    category: category
  }, function(err, result) {
    assert.equal(err, null);
    res.send('Delete Successful');
  });
};

function handleUser(user, res, db) {
  db.collection(config.mongoUsers).findOne(
    {'userId': user.id}, function(err, doc) {
      if (doc === null) {
        console.log('Creating User');
        createUser(user, res, db);
      } else {
        console.log('User found');
        res.redirect('/');
      }
    }
  );
};

function createUser(user, res, db) {
  var userInfo = {
    date: new Date(),
    userId: user.id,
    name: user.displayName
  };
  db.collection(config.mongoUsers).insert(userInfo, function(err, doc) {
    createDefaultCategory(user.id, res, db);
  });
};

function createDefaultCategory(userId, res, db) {
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

module.exports = {
  loadData: loadData,
  addEntry: addEntry,
  loadCategories: loadCategories,
  createCategory: createCategory,
  deleteCategory: deleteCategory,
  handleUser: handleUser,
};

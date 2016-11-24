var config = process.env.PRODUCTION === 'true' ? require('./config') : require('./localConfig');
var assert = require('assert');
var moment = require('moment');

function loadData(req, res, db) {
  if (req.user === undefined) {
    guestData(res, startDate());
  } else {
    getDailyandTotalData(startDate(), res, req.user.id, req.query.category, db);
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
    getDailyandTotalData(startDate(), res, req.body.userId, req.body.category, db);
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
      _id: '$monthDay',
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
  var totalCount = remaining[0] ? remaining[0].count : 0;
  var countsCopy = daily.slice();
  var dailyCount = daily.reduce(function(acc, item) {
    return acc + (Number.isInteger(item) ? item : 0);
  }, 0);
  var remainingCount = totalCount - dailyCount;

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

function startDate() {
  return new Date(moment().subtract(6, 'days')
    .startOf('day').toISOString());
};

module.exports = {
  loadData: loadData,
  addEntry: addEntry
}
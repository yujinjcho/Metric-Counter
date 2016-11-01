var express = require('express');
var app = express();
var assert = require('assert');
var moment = require('moment');
var Config = require('./config');
var MongoClient = require('mongodb').MongoClient;
var bodyParser = require('body-parser');
var db;

app.use(express.static('dist'));

app.get('/api/data', function(req, res) {
  chartData(res);
});

app.use(bodyParser.json());
app.post('/api/add', function(req, res) {
  var timeStamp = new Date();
  var newEntry = {
    date: timeStamp,
    monthDay: (timeStamp.getMonth() + 1) + '-' + timeStamp.getDate()
  };

  db.collection(Config.MONGO_COLLECTION).insert(newEntry, function(err, doc) {
    assert.equal(null, err);
    console.log('Entry has been added');
    chartData(res);
  });
});

function chartData(res) {
  var start = new Date(moment().subtract(6, 'days')
    .startOf('day').toISOString());
  getDailyandTotalData(start, res);
};

function getDailyandTotalData(date, res) {
  db.collection(Config.MONGO_COLLECTION).aggregate([
    {$match: {
      'date': {
        $gte: date,
      }
    }},
    {$group: {
      _id: '$monthDay',
      count: {$sum: 1}
    }}
  ], function(err, data) {
    assert.equal(null, err);
    getTotalBefore(date, data, res);
  });
};

function getTotalBefore(date, dailyData, res) {
  db.collection(Config.MONGO_COLLECTION).aggregate([
    {$match: {
      'date': {
        $lt: date,
      }
    }},
    {$group: {
      _id: null,
      count: {$sum: 1}
    }}
  ], function(err, data) {
    assert.equal(null, err);
    var result = formatData(data, dailyData);
    res.json(result);
  });
};

function formatData(remaining, lastSevenDays) {
  var dateLabels = getDatesLabelInput();
  var dailyData = formatDailyInput(lastSevenDays, dateLabels);
  var cumulativeData = formatCumulativeInput(dailyData, remaining);
  return {
    dateLabels: dateLabels,
    dailyData: dailyData,
    cumulativeData: cumulativeData
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

MongoClient.connect(Config.MONGO_DEV, function(err, dbConnection) {
  db = dbConnection;
  var server = app.listen(Config.LOCALHOSTPORT, function() {
    var port = server.address().port;
    console.log('Started server at port:', port);
  });
});

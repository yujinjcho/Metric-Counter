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
  getData(res);
});

app.use(bodyParser.json());
app.post('/api/add', function(req, res) {
  var newEntry = {
    'date': new Date()
  }

  db.collection(Config.MONGO_COLLECTION).insertOne(newEntry, function(err, doc) {
    assert.equal(null, err);
    console.log('Entry has been added');
    res.json(doc);
  });
});

function getData(res) {
  var start = new Date(moment().subtract(6, 'days').startOf('day').toISOString());
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
      _id: {
        month: {$month: '$date'},
        day: {$dayOfMonth: '$date'}
      },
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
    'dateLabels': dateLabels,
    'dailyData': dailyData,
    'cumulativeData': cumulativeData
  };
};

function getDatesLabelInput() {
  var dates = ['x'];

  for (i = 0; i < 6; i++) {
    var dateObj = new Date(moment().subtract(i, 'days').toISOString());
    var month = dateObj.getMonth() + 1;
    var date = dateObj.getDate() + 1;
    var label =  month.toString() + '-' + date.toString();
    dates.splice(1, 0, label);
  };

  return dates;
};

function formatDailyInput(agg, datesInput) {
  var counts = ['daily'];
  var dataDict = formatAggregation(agg);

  for (i = 1; i < datesInput.length; i++) {
    if (datesInput[i] in dataDict) {
      counts.push(dataDict[datesInput[i]]);
    } else {
      counts.push(0);
    }
  };
  return counts;
};

function formatCumulativeInput(daily, remaining) {
  var remainingCount = remaining[0].count;
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

function formatAggregation(agg) {
  var data = {};

  for (var i = 0; i < agg.length; i++) {
    var monthDay = agg[i]._id.month.toString() +
      '-' + agg[i]._id.day.toString();
    data[monthDay] = agg[i].count;
  };
  return data;
};

MongoClient.connect(Config.MONGO_DEV, function(err, dbConnection) {
  db = dbConnection;
  var server = app.listen(Config.LOCALHOSTPORT, function() {
    var port = server.address().port;
    console.log('Started server at port:', port);
  });
});

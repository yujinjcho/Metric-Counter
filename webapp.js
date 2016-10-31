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
    // don't need quotes for key
    'date': new Date()
  }

  db.collection(Config.MONGO_COLLECTION).insertOne(newEntry, function(err, doc) {
    assert.equal(null, err);
    console.log('Entry has been added');
    res.json(doc);
  });
});

// i think better to not prefix function names with 'get'
// name should already be descriptive of what gets returned
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
    // don't need quotes for keys
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
    // i don't think you need to call toString()
    var label =  month.toString() + '-' + date.toString();
    // is this just prepending each label to the dates array? kinda confusing using splice
    // could do something like this to be more intuitive:
    // var dates = [];
    // for (...) {
    //   ...
    //   dates.unshift(label);
    // }
    // return ['x'].concat(dates);
    dates.splice(1, 0, label);
  };

  return dates;
};

function formatDailyInput(agg, datesInput) {
  var counts = ['daily'];
  var dataDict = formatAggregation(agg);

  for (i = 1; i < datesInput.length; i++) {
    // this if-else can be simplified to:
    // counts.push(dataDict[datesInput[i]] || 0);
    //
    // also, some semi-related thoughts:
    // i think it's generally better practice to use the array functions (map, reduce, etc.)
    // than for loops in js since they give you direct access to the iterated element.
    // arguable whether always more readable.. but this function could be:
    //
    // var dataDict = formatAggregation(agg);
    // return ['daily'].concat(datesInput.splice(1).map(function(date) {
    //   return dataDict[date] || 0;
    // });
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

  // could skip assigning to this intermediate variable since you're just returning immediately after
  //
  // return countsCopy.map(function(item) {
  //   return item === 'daily' ? 'daily' : item + remainingCount;
  // });
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

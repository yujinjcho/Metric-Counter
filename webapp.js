var express = require('express');
var app = express();
var assert = require('assert');
var Config = require('./config');
var MongoClient = require('mongodb').MongoClient;
var db;

var daily = [
  ['x', '01-01', '01-02', '01-03', '01-04', '01-05', '01-06', '01-07'],
  ['daily', 2, 2, 3, 3, 4, 4, 10]
];
var cumulative = [
  ['x', '01-01', '01-02', '01-03', '01-04', '01-05', '01-06', '01-07'],
  ['daily', 2, 4, 7, 10, 14, 19, 24]
];

app.use(express.static('dist'));

app.get('/api/daily1', function(req, res) {
  res.json(daily)
});

app.get('/api/daily', function(req, res) {
  var start = new Date();
  start.setDate(start.getDate()-6);

  db.collection(Config.MONGO_COLLECTION).aggregate([
    {
      $match: {
        'date' : {
          $gte: start,
        }
      }
    },
    {
      $group: {
        _id: {
          month: { $month: '$date' },
          day: { $dayOfMonth: '$date'}
        },
        count:{$sum:1}
      }
    }
  ], function(err, data) {
    assert.equal(null, err);
    res.json(formatData(data))
  });
});

app.get('/api/cumulative', function(req, res) {
  res.json(cumulative)
});

function formatData(agg) {
  var dates = ['x'];
  var counts = ['daily'];
  var dataDict = formatAggregation(agg);

  var today = new Date();

  for (i=0; i<7; i++) {
    var month = today.getMonth() + 1;
    var dayOfMonth = today.getDate() + 1;
    var label = month.toString() + '-' + dayOfMonth.toString();

    dates.splice(1, 0, label);

    if (label in dataDict) {
      counts.splice(1, 0, dataDict[label]);
    } else {
      counts.splice(1, 0, 0);
    }

    today.setDate(today.getDate()-1);
  };

  return [dates, counts];
};

function formatAggregation(agg) {
  var data = {};

  for (var i=0; i < agg.length; i++) {
    var monthDay = agg[i]._id.month.toString() + '-' + agg[i]._id.day.toString();
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

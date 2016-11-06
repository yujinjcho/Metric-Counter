var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://localhost:27017/metric_counter';
var assert = require('assert');
var moment = require('moment');

function recentCategories(db) {
  /*
  db.collection('metrics').aggregate([
    {$match: {
      $and: [
        {'date': {$gte: startDate()}},
        {'userId': '10207897850619690'}
      ]
    }},
    {$group: {
      _id: '$monthDay',
      count: {$sum: 1}
    }}
  ], function(err, data) {
    assert.equal(null, err);
    console.log(data);
  });
*/
  db.collection('metrics').aggregate([
    {$match: {'userId': '10207897850619690'}},
    {$sort: {date:1}},
    {$group: {
      _id: '$category',
      recent: {$last: '$date'}
    }}
  ], function(err, data) {
    assert.equal(null, err);
    console.log(data);
  });

/*

*/
};

function startDate() {
  return new Date(moment().subtract(6, 'days')
    .startOf('day').toISOString());
};

function createEntry(db) {
  var timeStamp = new Date(2016, 10, 5);
  var entry = {
    date: timeStamp,
    userId: '10207897850619690',
    category: 'Other',
    monthDay: (timeStamp.getMonth() + 1) + '-' + timeStamp.getDate(),
  };
  db.collection('metrics').insert(entry, function(data){
    console.log('success');
  });
};

function createMultipleEntries(db, time) {
  for (var i = 0; i < time; i++) {
    createEntry(db);
  };
}

function removeNoCategories(db) {
  db.collection('metrics').remove({'category': {'$exists': false}});
}


MongoClient.connect(url, function(err, db) {
  recentCategories(db);
  //createMultipleEntries(db, 3);
  //removeNoCategories(db);
});







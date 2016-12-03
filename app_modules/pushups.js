var config = process.env.PRODUCTION === 'true' ?
  require('../config') :
  require('../localConfig');

var assert = require('assert');
var moment = require('moment');

var GOAL = 5000;

function renderLeaderboard(db, res, userData) {
  db.collection(config.mongoCollection).aggregate([
    {$match: {
      $or: [
        {'category': 'pushups'},
        {'category': 'Pushups'},
      ]
    }},
    {$group: {
      _id: {
        category: '$category',
        userId: '$userId'
      },
      count: { $sum: '$amount' },
      startDate: { $min: '$date' }
    }}
  ], function(err, data) {
    assert.equal(null, err);

    res.render('leaderboard', { users: usersSummary(data, userIdNameMapping(userData)) });
  });
}

function userIdNameMapping(userData) {
  return userData.reduce(function(acc, item) {
    return Object.assign(acc, { [item._id.userId]: item._id.name });
  }, {});
}

function usersSummary(userData, userIdNameMapping) {
  var today = moment(new Date());

  var statsByUser = userData.reduce(function(acc, item) {
    var days = today.diff(moment(item.startDate), 'days') + 1;
    var dailyAverage = Math.round(item.count / days * 10) / 10;
    var projectedDaysLeft = Math.round((GOAL - item.count) / dailyAverage);

    return Object.assign(
      acc,
      {
        [item._id.userId]: {
          count: item.count,
          days: days,
          dailyAverage: dailyAverage,
          progress: Math.round(item.count / GOAL * 100) + '%',
          projectedDaysLeft: projectedDaysLeft
        }
      }
    );
  }, {})

  return Object.keys(userIdNameMapping)
    .map(function(userId) {
      return Object.assign(
        {},
        { name: userIdNameMapping[userId] },
        statsByUser[userId]
      );
    })
    .filter(function(user) { return Number.isInteger(user.count) })
    .sort(function(a, b) { return b.count - a.count });
}

module.exports = {
  renderLeaderboard: renderLeaderboard
};

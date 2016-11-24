

function createDateLabels() {
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

function dailyData(aggregatedDailyData, datesInput) {
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

function cumulativeData(daily, remaining) {
  var totalCount = remaining[0] ? remaining[0].count : 0;
  var dailyCount = daily.reduce(function(acc, item) {
    return acc + (Number.isInteger(item) ? item : 0);
  }, 0);

  return daily.reduce(function(acc, item, i) {
    if (i === 0) {
      acc.push(item);
    } else if (i === 1) {
      acc.push(item + totalCount - dailyCount;);
    } else {
      acc.push(acc[acc.length-1] + item);
    };
    return acc;
  }, []);
};

module.exports = {
  createDateLabels: createDateLabels,
  dailyData: dailyData,
  cumulativeData: cumulativeData
};
function format(remaining, lastSevenDays, userId) {
  var dateLabels = createDateLabels();
  var dailyData = formatDaily(lastSevenDays, dateLabels);
  var cumulativeData = formatCumulative(dailyData, remaining);
  return {
    dateLabels: dateLabels,
    dailyData: dailyData,
    cumulativeData: cumulativeData,
    user: userId
  };
}

function createDateLabels() {
  var dates = [];
  var dateObj = new Date();

  for (i = 0; i < 6; i++) {
    var year = dateObj.getFullYear() - 2000;
    var month = dateObj.getMonth() + 1;
    var date = dateObj.getDate() ;
    var label = `${month}-${date}-${year}`;
    dates.unshift(label);
    dateObj.setDate(dateObj.getDate() - 1);
  };

  return ['x'].concat(dates);
}

function formatDaily(aggregatedDailyData, datesInput) {
  var dataDict = aggregatedDailyData.reduce(
    function(d, item) {
      var dateLabel = `${item._id.monthDay}-${item._id.year-2000}`
      d[dateLabel] = item.count;
      return d;
    }, {}
  );

  return ['daily'].concat(datesInput.slice(1).map(function(date) {
    return dataDict[date] || 0;
  }));
}

function formatCumulative(daily, remaining) {
  var totalCount = remaining[0] ? remaining[0].count : 0;
  var dailyCount = daily.reduce(function(acc, item) {
    return acc + (Number.isInteger(item) ? item : 0);
  }, 0);

  return daily.reduce(function(acc, item, i) {
    if (i === 0) {
      acc.push(item);
    } else if (i === 1) {
      acc.push(item + totalCount - dailyCount);
    } else {
      acc.push(acc[acc.length - 1] + item);
    };
    return acc;
  }, []);
}

module.exports = {
  format: format,
  createDateLabels: createDateLabels
};

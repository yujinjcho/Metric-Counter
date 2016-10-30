var express = require('express');
var app = express();

var daily = [
  ['x', '01-01', '01-02', '01-03', '01-04', '01-05', '01-06', '01-07'],
  ['daily', 2, 2, 3, 3, 4, 4, 10]
];
var cumulative = [
  ['x', '01-01', '01-02', '01-03', '01-04', '01-05', '01-06', '01-07'],
  ['daily', 2, 4, 7, 10, 14, 19, 24]
];

app.use(express.static('dist'));

app.get('/api/daily', function(req, res) {
  res.json(daily)
});

app.get('/api/cumulative', function(req, res) {
  res.json(cumulative)
});

var server = app.listen(3000, function() {
  var port = server.address().port;
  console.log('Started server at port:', port);
})
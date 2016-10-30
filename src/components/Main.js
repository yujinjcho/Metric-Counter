
var React = require('react');
var Grid = require('react-bootstrap/lib/Grid');
var Row = require('react-bootstrap/lib/Row');
var Col = require('react-bootstrap/lib/Col');
var ChartContainer = require('./ChartContainer');
var ButtonContainer = require('./ButtonContainer');
var NavbarInstance = require('./NavbarInstance');

var Main = React.createClass({
  getInitialState: function() {
    return {
      dailyPoints: ['daily', 2, 2, 3, 3, 4, 4, 10],
      dailyDates: ['x', '01-01', '01-02', '01-03', '01-04', '01-05', '01-06', '01-07'],
      cumulativePoints: ['daily', 2, 4, 5, 6, 7, 8, 10],
      cumulativeDates: ['x', '01-01', '01-02', '01-03', '01-04', '01-05', '01-06', '01-07']
    }
  },
  componentDidMount: function() {
    var newPoints = ['daily', 2, 2, 3, 3, 4, 4, 2];
    var newDates = ['x', '01-01', '01-02', '01-03', '01-04', '01-05', '01-06', '01-07'];
    var newCumulativePoints = ['daily', 2, 4, 5, 6, 7, 8, 15];
    var newCumulativeDates = ['x', '01-01', '01-02', '01-03', '01-04', '01-05', '01-06', '01-07'];

    this.setState({
      dailyPoints: newPoints,
      dailyDates: newDates,
      cumulativePoints: newCumulativePoints,
      cumulativeDates: newCumulativeDates
    });
  },
  render: function() {
    var mainContainer = {
      display: 'flex',
      flexFlow: 'column',
      height: '100%',
      paddingLeft: 0,
      paddingRight: 0
    };

    return (
      <Grid style={mainContainer}>
        <NavbarInstance />
        <ChartContainer
          dailyPoints={this.state.dailyPoints}
          dailyDates={this.state.dailyDates}
          cumulativePoints={this.state.cumulativePoints}
          cumulativeDates={this.state.cumulativeDates}
        />
        <ButtonContainer />
      </Grid>
    )
  }
});

module.exports = Main;

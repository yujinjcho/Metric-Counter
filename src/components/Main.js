
var React = require('react');
var Grid = require('react-bootstrap/lib/Grid');
var Row = require('react-bootstrap/lib/Row');
var Col = require('react-bootstrap/lib/Col');
var ChartContainer = require('./ChartContainer');
var ButtonContainer = require('./ButtonContainer');

var Main = React.createClass({
  render: function() {
    var mainContainer = {
      display: 'flex',
      flexFlow: 'column',
      height: '100%'
    };

    const gridInstance = (
      <Grid style={mainContainer}>
        <ChartContainer />
        <ButtonContainer />
      </Grid>
    )

    return gridInstance
  }
});

module.exports = Main;

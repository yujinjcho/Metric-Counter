
var React = require('react');
var Grid = require('react-bootstrap/lib/Grid');
var $ = require('jquery');

var ChartContainer = require('./ChartContainer');
var ButtonContainer = require('./ButtonContainer');
var NavbarInstance = require('./NavbarInstance');

var Main = React.createClass({
  getInitialState: function() {
    return {
      dateLabels: [],
      dailyData: [],
      cumulativeData: []
    };
  },

  componentDidMount: function() {
    this.loadData();
  },

  loadData: function() {
    $.ajax('/api/data').done(function(data) {
      this.setState(data);
    }.bind(this));
  },

  addOne: function() {
    var entry = {
      'user': '1'
    };
    $.ajax({
      type: 'POST',
      url: '/api/add',
      contentType: 'application/json',
      data: JSON.stringify(entry),
      success: function(data) {
        this.setState(data);
      }.bind(this),
      error: function(xhr, status, err) {
        console.log('Error adding entry: ', err);
      }
    });
  },

  render: function() {
    var mainContainer = {
      display: 'flex',
      flexFlow: 'column',
      height: '100%',
      width: '100%',
      paddingLeft: 0,
      paddingRight: 0
    };

    return (
      <Grid style={mainContainer}>
        <NavbarInstance />
        <ChartContainer {...this.state} />
        <ButtonContainer addOne={this.addOne}/>
      </Grid>
    );
  }
});

module.exports = Main;

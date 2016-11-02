
var React = require('react');
var Grid = require('react-bootstrap/lib/Grid');
var $ = require('jquery');

var ChartContainer = require('./ChartContainer');
var ButtonContainer = require('./ButtonContainer');
var NavbarInstance = require('./NavbarInstance');

require('../../static/css/main.css');

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

    return (
      <Grid className='main'>
        <NavbarInstance />
        <ChartContainer {...this.state} />
        <ButtonContainer addOne={this.addOne}/>
      </Grid>
    );
  }
});

module.exports = Main;

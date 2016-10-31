
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
    }
  },
  componentDidMount: function() {
    this.loadData();
  },
  loadData: function() {
    $.ajax('/api/data').done(function(data){
      this.setState({
        dateLabels: data.dateLabels,
        dailyData: data.dailyData,
        cumulativeData: data.cumulativeData
      });
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
        this.loadData();
      }.bind(this),
      error: function(xhr, status, err) {
        console.log("Error adding entry: ", err);
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
        <ChartContainer
          dateLabels={this.state.dateLabels}
          dailyData={this.state.dailyData}
          cumulativeData={this.state.cumulativeData}
        />
        <ButtonContainer addOne={this.addOne}/>
      </Grid>
    )
  }
});

module.exports = Main;

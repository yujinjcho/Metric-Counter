
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
  // i would put newlines between functions
  componentDidMount: function() {
    this.loadData();
  },
  loadData: function() {
    $.ajax('/api/data').done(function(data){
      // since the data object is the same shape as the required state,
      // i think can just do: this.setState(data);
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
      // what does the endpoint return (what's 'data')?
      // if it's the same as the GET endpoint, can just directly set state
      // instead of making another call
      success: function(data) {
        this.loadData();
      }.bind(this),
      error: function(xhr, status, err) {
        console.log("Error adding entry: ", err);
      }
    });
  },
  render: function() {
    // arguably better to define styles in stylesheet and not inline
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
        // i think you can do this to pass the entire state down:
        // <ChartContainer {...this.state} />
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

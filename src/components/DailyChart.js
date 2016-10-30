var React = require('react');
var update = require('react-addons-update');
var $ = require('jquery');
import C3Chart from 'react-c3js';


var DailyChart = React.createClass({
  getInitialState: function() {
    return {
      chartTitle: {
        text: 'Daily'
      },
      chartData: {
        x: 'x',
        xFormat: '%m-%d',
        columns: [],
        types: {
          daily: 'bar'
        },
        labels:true
      }
    }
  },
  componentDidMount: function() {
    $.ajax('/api/daily').done(function(data){
      this.setState({
        chartData: update(this.state.chartData, {columns: {$set: data}})
      });
    }.bind(this));
  },
  render: function() {
    return (
      <C3Chart
        style={this.props.style}
        title={this.state.chartTitle}
        data={this.state.chartData}
        legend={this.props.legend}
        axis={this.props.axis}
      />
    )
  }
});


module.exports = DailyChart;
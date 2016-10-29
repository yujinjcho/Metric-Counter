var React = require('react');
var update = require('react-addons-update');
import C3Chart from 'react-c3js';


var CumulativeChart = React.createClass({
  getInitialState: function() {
    return {
      chartTitle: {
        text: 'Cumulative'
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
    var cols = [
      ['x', '01-01', '01-02', '01-03', '01-04', '01-05', '01-06', '01-07'],
      ['daily', 2, 4, 7, 10, 14, 19, 24]
    ];
    this.setState({
      chartData: update(this.state.chartData, {columns: {$set: cols}})
    });
  },
  render: function() {
    return (
      <C3Chart
        style={this.props.style}
        title={this.state.title}
        data={this.state.chartData}
        legend={this.props.legend}
        axis={this.props.axis}
      />
    )
  }
});


module.exports = CumulativeChart;
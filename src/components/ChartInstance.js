var React = require('react');
import C3Chart from 'react-c3js';

require('../../static/css/chart-instance.css');

var ChartInstance = React.createClass({
  getInitialState: function() {
    return {
      axis: {
        x: {
          type: 'timeseries',
          localtime: false,
          tick: {
            format: '%m-%d-%y'
          }
        }
      },
      legend: {
        hide: true
      }
    };
  },

  formatData: function() {
    var chartData = {
      x: 'x',
      xFormat: '%m-%d-%y',
      columns: [this.props.dates, this.props.data],
      types: {
        daily: 'bar'
      },
      labels:true
    };
    return chartData;
  },

  formatTitle: function() {
  },

  render: function() {
    return (
      <C3Chart
        className='chart-instance'
        title={ { text: this.props.title } }
        data={this.formatData()}
        legend={this.state.legend}
        axis={this.state.axis}
      />
    )
  }
});


module.exports = ChartInstance;
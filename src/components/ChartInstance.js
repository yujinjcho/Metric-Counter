var React = require('react');
import C3Chart from 'react-c3js';


var ChartInstance = React.createClass({
  getInitialState: function() {
    return {
      chartStyle: {
        flex: 2,
        overflow: 'visible',
        paddingTop: 15,
        width: '97%'
      },
      chartTitle: {
        text: this.props.title
      },
      chartData: {
        x: 'x',
        xFormat: '%m-%d',
        columns: this.props.data,
        types: {
          daily: 'bar'
        },
        labels:true
      },
      axis: {
        x: {
          type: 'timeseries',
          localtime: false,
          tick: {
            format: '%m-%d'
          }
        }
      },
      legend: {
        hide: true
      }
    }
  },
  render: function() {
    return (
      <C3Chart
        style={this.state.chartStyle}
        title={this.state.chartTitle}
        data={this.state.chartData}
        legend={this.state.legend}
        axis={this.state.axis}
      />
    )
  }
});


module.exports = ChartInstance;
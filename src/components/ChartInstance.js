var React = require('react');
import C3Chart from 'react-c3js';


var ChartInstance = React.createClass({
  formatData: function() {
    var chartData = {
      x: 'x',
      xFormat: '%m-%d',
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
        style={this.props.style}
        title={ { text: this.props.title } }
        data={this.formatData()}
        legend={this.props.legend}
        axis={this.props.axis}
      />
    )
  }
});


module.exports = ChartInstance;
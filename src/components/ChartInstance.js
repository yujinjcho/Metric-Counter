var React = require('react');
import C3Chart from 'react-c3js';


var ChartInstance = React.createClass({
  getInitialState: function() {
    return {
      title: {
        text: this.props.title
      }
    }
  },
  formatData: function() {
    var dates = this.props.dates;
    var points = this.props.data;
    return this.props.formatInputs(dates, points);
  },
  formatTitle: function() {

  },
  render: function() {
    return (
      <C3Chart
        style={this.props.style}
        title={this.state.title}
        data={this.formatData()}
        legend={this.props.legend}
        axis={this.props.axis}
      />
    )
  }
});


module.exports = ChartInstance;
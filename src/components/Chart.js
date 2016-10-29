var React = require('react');

var Chart = React.createClass({
  getInitialState: function() {
    return {
      chartStyle: {
        border: '1px solid black',
        flex: 2,
        overflow: 'auto'
      }
    }
  },
  render: function() {
    return (
      <div style={this.state.chartStyle}>
        {this.props.title}
      </div>
    )
  }
});


module.exports = Chart;
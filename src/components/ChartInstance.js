var React = require('react');
import C3Chart from 'react-c3js';

var data = {
  x: 'x',
  xFormat: '%m-%d',
  columns: [
    ['x', '01-01', '01-02', '01-03', '01-04', '01-05', '01-06', '01-07'],
    ['daily', 5, 3, 10, 11, 5, 5, 22]
  ],
  types: {
    daily: 'bar'
  },
  labels:true
};
var axis = {
  x: {
    type: 'timeseries',
    localtime: false,
    tick: {
      format: '%m-%d'
    }
  }
};
var legend = {
  hide: true
};


var ChartInstance = React.createClass({
  getInitialState: function() {
    return {
      chartStyle: {
        flex: 2,
        overflow: 'visible',
        paddingTop: 15,
        width: '97%'
      },
      titleName: {
        text: this.props.title
      }
    }
  },
  render: function() {
    return (
      <C3Chart style={this.state.chartStyle} title={this.state.titleName} data={data} legend={legend} axis={axis}/>
    )
  }
});


module.exports = ChartInstance;
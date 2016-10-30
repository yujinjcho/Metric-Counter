var React = require('react');
var Row = require('react-bootstrap/lib/Row');
var Col = require('react-bootstrap/lib/Col');
var DailyChart = require('./DailyChart');
var CumulativeChart = require('./CumulativeChart');


var ChartContainer = React.createClass({
  render: function() {
    var chartRow = {
      flex: 2,
      overflow: 'visible'
    };

    var chartContainer = {
      textAlign: 'center',
      display: 'flex',
      flexFlow: 'column',
      height: '100%',
      paddingTop: 50
    };

    var divider = {
      border: '1px solid #CCCCCC',
      height: 1,
      width: '100%'
    };

    var chartFormat = {
      chartStyle: {
        flex: 2,
        overflow: 'visible',
        paddingTop: 15,
        width: '97%'
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
    };

    return (
      <Row className='show-grid' style={chartRow}>
        <Col style={chartContainer} xs={12}>
            <DailyChart
              style={chartFormat.chartStyle}
              axis={chartFormat.axis}
              legend={chartFormat.legend}
            />
            <div style={divider}></div>
            <CumulativeChart
              style={chartFormat.chartStyle}
              axis={chartFormat.axis}
              legend={chartFormat.legend}
            />

        </Col>
      </Row>
    )
  }
});

module.exports = ChartContainer;
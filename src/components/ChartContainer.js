var React = require('react');
var Row = require('react-bootstrap/lib/Row');
var Col = require('react-bootstrap/lib/Col');
var ChartInstance = require('./ChartInstance');


var ChartContainer = React.createClass({
  formatDataInput: function(dates, points) {
    var chartData = {
      x: 'x',
      xFormat: '%m-%d',
      columns: [dates, points],
      types: {
        daily: 'bar'
      },
      labels:true
    };
    return chartData;
  },
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
            <ChartInstance
              title="Daily"
              style={chartFormat.chartStyle}
              axis={chartFormat.axis}
              legend={chartFormat.legend}
              points={this.props.dailyPoints}
              dates={this.props.dailyDates}
              formatInputs={this.formatDataInput}
            />
            <div style={divider}></div>
            <ChartInstance
              title="Cumulative"
              style={chartFormat.chartStyle}
              axis={chartFormat.axis}
              legend={chartFormat.legend}
              points={this.props.cumulativePoints}
              dates={this.props.cumulativeDates}
              formatInputs={this.formatDataInput}
            />
        </Col>
      </Row>
    )
  }
});

module.exports = ChartContainer;
var React = require('react');
var Row = require('react-bootstrap/lib/Row');
var Col = require('react-bootstrap/lib/Col');
var Chart = require('./Chart');

var ChartContainer = React.createClass({
  render: function() {
    var chartRow = {
      flex: 2,
      overflow: 'auto'
    };

    var chartContainer = {
      textAlign: 'center',
      display: 'flex',
      flexFlow: 'column',
      height: '100%',
      background: 'yellow'
    };

    return (
      <Row className='show-grid' style={chartRow}>
        <Col style={chartContainer} xs={12}>
            <Chart title='Title1' />
            <Chart title='Title2' />
        </Col>
      </Row>
    )
  }
});


module.exports = ChartContainer;
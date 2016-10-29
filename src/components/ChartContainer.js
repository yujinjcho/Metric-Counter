var React = require('react');
var Row = require('react-bootstrap/lib/Row');
var Col = require('react-bootstrap/lib/Col');
var ChartInstance = require('./ChartInstance');

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

    return (
      <Row className='show-grid' style={chartRow}>
        <Col style={chartContainer} xs={12}>
            <ChartInstance title='Daily' />
            <div style={divider}></div>
            <ChartInstance title='Cumulative' />
        </Col>
      </Row>
    )
  }
});


module.exports = ChartContainer;
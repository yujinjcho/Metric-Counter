var React = require('react');
var Row = require('react-bootstrap/lib/Row');
var Col = require('react-bootstrap/lib/Col');

var ChartContainer = React.createClass({
  render: function() {
    var chartRow = {
      flex: 2,
      overflow: 'auto'
    };

    var chartContainer = {
      textAlign: 'center',
    };

    return (
      <Row className='show-grid' style={chartRow}>
        <Col style={chartContainer} xs={12}>
          Chart Container
        </Col>
      </Row>
    )
  }
});


module.exports = ChartContainer;
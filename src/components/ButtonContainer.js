var React = require('react');
var Row = require('react-bootstrap/lib/Row');
var Col = require('react-bootstrap/lib/Col');

var ButtonContainer = React.createClass({
  render: function() {
    var buttonRow = {
      border: '1px solid blue',
      background: 'yellow',
      height: 30
    }

    var buttonContainer = {
      textAlign: 'center',
    };

    return (
      <Row className='show-grid' style={buttonRow}>
        <Col style={buttonContainer} xs={12}>
          Submit
        </Col>
      </Row>
    )
  }
});


module.exports = ButtonContainer;
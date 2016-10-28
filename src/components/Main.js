
var React = require('react');
var Grid = require('react-bootstrap/lib/Grid');
var Row = require('react-bootstrap/lib/Row');
var Col = require('react-bootstrap/lib/Col');


var Main = React.createClass({
  render: function(){
    var chartContainer = {
      border: '1px solid black',
      textAlign: 'center'
    };

    var buttonContainer = {
      border: '1px solid red',
      textAlign: 'center'
    };

    const gridInstance = (
      <Grid>
        <Row className='show-grid'>
          <Col style={chartContainer} xs={12} sm={6} md={6}>
            Chart Container
          </Col>
          <Col style={buttonContainer} xs={12} sm={6} md={6}>
            Button Container
          </Col>
        </Row>
      </Grid>
    )

    return gridInstance
  }
});

module.exports = Main;

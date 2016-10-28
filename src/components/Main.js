import './Main.css';

var React = require('react');
var Col = require('react-bootstrap/lib/Col');


var Main = React.createClass({
  render: function(){
    return (
      <div>
        <Col bsClass='chart-container' xs={12} mid={8}>
          Chart Container
        </Col>

        <Col bsClass='button-container' xs={12} mid={8}>
          Button Container
        </Col>
      </div>
    )
  }
});

module.exports = Main;

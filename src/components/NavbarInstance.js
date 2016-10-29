var React = require('react');
var Row = require('react-bootstrap/lib/Row');
var Col = require('react-bootstrap/lib/Col');
var update = require('react-addons-update');

var NavbarInstance = React.createClass({
  getInitialState: function() {
    return {
      navbarRow: {
        height: 50,
        background: '#001f3f',
        fontSize: 20,
        fontFamily: 'arial',
        paddingTop: 10,
        color: '#DDDDDD'
      }
    }
  },
  render: function() {
    var navbarInstance = {
      textAlign: 'center',
    };

    return (
      <Row className='show-grid' style={this.state.navbarRow} onClick={this.handleClick}>
        <Col style={navbarInstance} xs={12}>
          Counter 9000
        </Col>
      </Row>
    )
  },
  handleClick: function() {
    alert('hi')
  }
});


module.exports = NavbarInstance;
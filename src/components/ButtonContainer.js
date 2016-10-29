var React = require('react');
var Row = require('react-bootstrap/lib/Row');
var Col = require('react-bootstrap/lib/Col');
var update = require('react-addons-update');

var ButtonContainer = React.createClass({
  getInitialState: function() {
    return {
      buttonStyle: {
        width: '98%',
        background: '#0074D9',
        height: 55,
        fontSize: 20,
        border: 'none',
        color: 'white',
        opacity: 0.8,
        boxShadow :'0 8px 16px 0 rgba(0,0,0,0.2), 0 6px 20px 0 rgba(0,0,0,0.19)',
        fontFamily: 'Arial'
      }
    }
  },
  render: function() {
    var buttonRow = {
      background: 'white',
      height: 65,
      textAlign: 'center'
    };

    return (
      <Row className='show-grid' style={buttonRow}>
          <button style={this.state.buttonStyle} onClick={ this.handleClick }>
            Submit
          </button>
      </Row>
    )
  },
  handleClick: function() {
    this.changeButtonStyle(0.5);
    setTimeout(function(){ this.changeButtonStyle(0.8) }.bind(this), 180);
  },
  changeButtonStyle: function(opacityLevel) {
    this.setState({
      buttonStyle: update(this.state.buttonStyle, {opacity: {$set: opacityLevel}})
    });

  }
});

module.exports = ButtonContainer;
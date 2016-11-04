var React = require('react');
var Row = require('react-bootstrap/lib/Row');
var Col = require('react-bootstrap/lib/Col');
require('../../static/css/button-container.css');

var ButtonContainer = React.createClass({
  getInitialState: function() {
    return {
      buttonStyleName: 'button-style'
    }
  },
  render: function() {
    return (
      <Row className='show-grid button-row'>
          <button className={this.state.buttonStyleName} onClick={ this.handleClick }>
            Submit
          </button>
      </Row>
    )
  },
  handleClick: function() {
    this.changeButtonStyle();
    setTimeout(function(){ this.changeButtonStyle() }.bind(this), 155);
    this.props.addOne();
  },
  changeButtonStyle: function(opacityLevel) {
    if (this.state.buttonStyleName === 'button-style') {
      this.setState({
        buttonStyleName: 'button-style button-clicked'
      });
    } else {
      this.setState({
        buttonStyleName: 'button-style'
      });
    };
  }
});

module.exports = ButtonContainer;
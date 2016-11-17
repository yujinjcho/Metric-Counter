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
          <div className={this.state.buttonStyleName}>
            <button className='increment control' onClick={this.decrementCount}>Remove</button>
            <button className='decrement control' onClick={this.incrementCount}>Add</button>
            <span>
              <input type="number" id='input-number' defaultValue='1' onKeyUp={this.handleInputKeyUp}/>
            </span>
          </div>
      </Row>
    )
  },

  handleInputKeyUp: function(e) {
    if (e.key === 'Enter') {
      this.props.incrementCount();
    }
  },

  incrementCount: function() {
    this.props.incrementCount();
  },

  decrementCount: function() {
    this.props.decrementCount();
  }
});

module.exports = ButtonContainer;
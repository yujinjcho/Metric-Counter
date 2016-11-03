var React = require('react');
var Col = require('react-bootstrap/lib/Col');
var update = require('react-addons-update');

require('../../static/css/navbar.css');

var NavbarInstance = React.createClass({
  getInitialState: function() {
    return {
      navbarName: 'navbar',
      caretName : 'fa fa-caret-down caret-drop'
    }
  },

  render: function() {
    var navbarInstance = {
      textAlign: 'center',
    };

    return (
      <div className={this.state.navbarName} >
          Metric Counter
          <div className="caret-container" onClick={this.handleClick}>
            <i className={this.state.caretName}></i>
          </div>
      </div>
    )
  },

  handleClick: function() {
    if (this.state.navbarName === 'navbar') {
      this.setState({navbarName: 'navbar extend'});
      this.setState({caretName: 'fa fa-caret-down caret-drop caret-extend'});
    } else {
      this.setState({navbarName: 'navbar'});
      this.setState({caretName: 'fa fa-caret-down caret-drop'});
    };
  }
});

module.exports = NavbarInstance;
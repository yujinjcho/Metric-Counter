var React = require('react');
var Col = require('react-bootstrap/lib/Col');
var update = require('react-addons-update');
var NavbarOptions = require('./NavbarOptions');

require('../../static/css/navbar.css');

var NavbarInstance = React.createClass({
  componentDidMount: function() {
    //this.handleClick();
  },

  getInitialState: function() {
    return {
      navbarName: 'navbar',
      caretName: 'fa fa-caret-down caret-drop',
      navbarOptionsName: 'navbar-options-hidden'
    }
  },

  render: function() {
    var navbarInstance = {
      textAlign: 'center',
    };

    return (
      <div className={this.state.navbarName} >
          The Metric Counter
          <div className="caret-container" onClick={this.handleClick}>
            <i className={this.state.caretName}></i>
          </div>
          <NavbarOptions
            options={this.state.navbarOptionsName}
          />
      </div>
    )
  },
  handleClick: function() {
    if (this.state.navbarName === 'navbar') {
      this.extendNavbar();
    } else {
      this.collapseNavbar();
    };
  },
  extendNavbar: function() {
    this.setState({navbarName: 'navbar extend'});
    this.setState({caretName: 'fa fa-caret-down caret-drop caret-extend'});
    this.setState({navbarOptionsName: 'navbar-options'});
  },
  collapseNavbar: function() {
    this.setState({navbarName: 'navbar'});
    this.setState({caretName: 'fa fa-caret-down caret-drop'});
    this.setState({navbarOptionsName: 'navbar-options-hidden'});
  }
});

module.exports = NavbarInstance;
var React = require('react');
var Col = require('react-bootstrap/lib/Col');
var update = require('react-addons-update');
var NavbarOptions = require('./NavbarOptions');

require('../../static/css/navbar.css');

var NavbarInstance = React.createClass({
  getInitialState: function() {
    return {
      navbarName: 'navbar',
      caretName: 'fa fa-caret-down caret-drop',
      navbarOptionsName: 'navbar-options-hidden',
      loginName: 'login login-hidden',
      accountName: 'account-container account-container-hidden'
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
            loginName = {this.state.loginName}
            accountName = {this.state.accountName}
            user = {this.props.user}
            categories = {this.props.categories}
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
    setTimeout(function(){
      this.setState({
        loginName: 'login',
        accountName: 'account-container'
      });
    }.bind(this), 100);
  },

  collapseNavbar: function() {
    this.setState({navbarName: 'navbar'});
    this.setState({caretName: 'fa fa-caret-down caret-drop'});
    this.setState({navbarOptionsName: 'navbar-options-hidden'});
    this.setState({loginName: 'login login-hidden'});
    this.setState({accountName: 'account-container account-container-hidden'});
  }
});

module.exports = NavbarInstance;
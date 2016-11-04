var React = require('react');
var UserOptions = require('./UserOptions');
require('../../static/css/navbar-options.css');

var NavbarOptions = React.createClass({
  /*
  <div className={this.props.loginName}>Login</div>

  <div className={this.props.AccountName}>
    <div className='navbar-buttons'>Category</div>
    <div className='navbar-buttons'>Edit</div>
    <div className='navbar-buttons'>Add</div>
    <div className='navbar-buttons'>Delete</div>
    <div className='navbar-buttons'>Logout</div>
  </div>
  */
  render: function() {
    return (
      <div className={this.props.options}>
        <UserOptions
          options={this.props.navbarOptionsName}
          loginName = {this.props.loginName}
          accountName = {this.props.accountName}
          user = {this.props.user}
        />
      </div>
    )
  }
});

module.exports = NavbarOptions;

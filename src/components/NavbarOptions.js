var React = require('react');

require('../../static/css/navbar-options.css');

var NavbarOptions = React.createClass({
  /*
  <div className='login'>Login</div>
  <div className={this.props.loginName}>Login</div>

  <div className='account-container'>
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
        <div className={this.props.loginName}>Login</div>
      </div>
    )
  }
});

module.exports = NavbarOptions;
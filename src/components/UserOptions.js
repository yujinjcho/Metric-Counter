var React = require('react');

var UserOptions = React.createClass({
  render: function() {
    return (this.props.user === null) ?
      <div className={this.props.loginName}>Login</div>:
      <div className={this.props.accountName}>
        <div className='navbar-buttons'>Category</div>
        <div className='navbar-buttons'>Edit</div>
        <div className='navbar-buttons'>Add</div>
        <div className='navbar-buttons'>Delete</div>
        <div className='navbar-buttons'>Logout</div>
      </div>
  }
});

module.exports = UserOptions;
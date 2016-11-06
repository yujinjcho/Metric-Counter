var React = require('react');
var CategorySlider = require('./CategorySlider');
require('../../static/css/user-options.css');

var UserOptions = React.createClass({
  render: function() {
    return (this.props.user === null) ?
      <div className={this.props.loginName} onClick={this.login}>
        Login
      </div>:
      <div className={this.props.accountName}>
        <div className='category-container'>
          <CategorySlider
            categories={this.props.categories}
            change = {this.props.change}
            collapse = {this.props.collapse}
          />
        </div>
        <div className='navbar-buttons'>Add</div>
        <div className='navbar-buttons'>Delete</div>
        <div className='navbar-buttons' onClick={this.logout}>
          Logout
        </div>
      </div>
  },
  logout: function() {
    window.location = '/logout'
  },
  login: function() {
    window.location = '/login'
  },
});

module.exports = UserOptions;

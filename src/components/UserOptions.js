var React = require('react');
var Slider = require('react-slick');
require('../../static/css/user-options.css');

var SimpleSlider = React.createClass({
  render: function () {
    var settings = {
      arrows: true,
      dots: false
    };
    return (
      <Slider {...settings}>
        <div>General</div>
      </Slider>
    );
  }
});

var UserOptions = React.createClass({
  render: function() {
    return (this.props.user === null) ?
      <div className={this.props.loginName} onClick={this.login}>
        Login
      </div>:
      <div className={this.props.accountName}>

        <div className='category-container'>
          <SimpleSlider />
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
  }
});

module.exports = UserOptions;
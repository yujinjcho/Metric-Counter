var React = require('react');
var UserOptions = require('./UserOptions');

require('../../static/css/navbar-options.css');

var NavbarOptions = React.createClass({
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

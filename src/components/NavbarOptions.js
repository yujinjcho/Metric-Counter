var React = require('react');

require('../../static/css/navbar-options.css');

var NavbarOptions = React.createClass({
  render: function() {
    return (
      <div className={this.props.options}>

      </div>
    )
  }
});

module.exports = NavbarOptions;
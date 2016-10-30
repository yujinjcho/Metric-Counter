var React = require('react');
var Col = require('react-bootstrap/lib/Col');
var update = require('react-addons-update');

var NavbarInstance = React.createClass({
  getInitialState: function() {
    return {
      navbar: {
        height: 50,
        background: '#001f3f',
        fontSize: 20,
        fontFamily: 'arial',
        paddingTop: 10,
        color: '#DDDDDD',
        position: 'absolute',
        width: '100%',
        textAlign: 'center',
        zIndex: 10
      },
      extend: false
    }
  },
  render: function() {
    var navbarInstance = {
      textAlign: 'center',
    };

    return (
      <div style={this.state.navbar} onClick={this.handleClick}>
          Counter 9000!
      </div>
    )
  },
  handleClick: function() {
    if (this.state.extend) {
      this.adjustHeight('50');
    } else {
      this.adjustHeight('100vh');
    };
    this.toggleExtend();
  },
  toggleExtend: function() {
    this.setState({extend: !this.state.extend});
  },
  adjustHeight: function(newHeight) {
    this.setState({
      navbar: update(this.state.navbar, {height: {$set: newHeight}})
    });
  }
});


module.exports = NavbarInstance;
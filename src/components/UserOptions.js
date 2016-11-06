var React = require('react');
var CategorySlider = require('./CategorySlider');
var $ = require('jquery');
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
        <div className='navbar-buttons' onClick={this.createCategory}>Add</div>
        <div className='navbar-buttons' onClick={this.deleteCategory}>Delete</div>
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
  createCategory: function() {
    var newCategory = prompt('Please name your new category');
    if (newCategory) {
      alert('New Category has been created');
      window.location = '/';
    } else {
      alert('Please include a name');
    }
  },
  deleteCategory: function() {
    var category = prompt(
      'You will lose all data associated with this category.'
      + ' If you wish to proceed, '
      + 'please confirm the name of the category.'
    );
    if (this.props.categories.length === 1) {
      alert('You cannot delete your last category');
    } else if (category === this.props.activeCategory) {

      $.ajax({
        type: 'DELETE',
        url: '/api/categories',
        dataType: 'json',
        data: {'category': this.props.activeCategory},
        success: function(data) {
          alert('Deleted!');
        },
        error: function(xhr, status, err) {
          console.log('Error adding entry: ', err);
        }
      });
    } else {
      alert('That did not match');
    }
  }
});

module.exports = UserOptions;

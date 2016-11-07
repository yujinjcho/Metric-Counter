var React = require('react');
var CategorySlider = require('./CategorySlider');
var $ = require('jquery');
require('../../static/css/user-options.css');
var url = require('url');

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
    var url = window.location;


    if (newCategory in this.props.categories) {
      alert('This category already exists!');
    } else if (newCategory.trim().length === 0 || newCategory === null) {
      alert('Please include a name');
    } else {
      $.ajax({
        type: 'POST',
        url: '/api/categories/' + newCategory,
        success: function(data, textStatus, xhr) {
          alert('Created!');
          window.location = '/';
        },
        error: function(xhr, status, err) {
          console.log('Error adding entry: ', err);
        }
      });
    };
  },
  deleteCategory: function() {
    var elem = document.getElementsByClassName('slick-active');
    var selectedCategory = elem[0].innerHTML;

    var category = prompt(
      'You will lose all data associated with the category "'
      + selectedCategory
      + '". If you wish to proceed, '
      + 'please confirm the name of the category.'
    );
    if (this.props.categories.length === 1) {
      alert('You cannot delete your last category');
    } else if (category === selectedCategory) {

      $.ajax({
        type: 'DELETE',
        url: '/api/categories/' + selectedCategory,
        success: function(data, textStatus, xhr) {
          alert('Deleted!');
          window.location = '/';
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

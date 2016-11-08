
var React = require('react');
var Grid = require('react-bootstrap/lib/Grid');
var $ = require('jquery');

var ChartContainer = require('./ChartContainer');
var ButtonContainer = require('./ButtonContainer');
var NavbarInstance = require('./NavbarInstance');

require('../../static/css/main.css');

var Main = React.createClass({
  getInitialState: function() {
    return {
      dateLabels: [],
      dailyData: [],
      cumulativeData: [],
      user: null,
      categories: [],
      activeCategory: ''
    };
  },

  componentDidMount: function() {
    this.loadData();
  },

  loadData: function() {
    this.loadCategories();
  },

  loadPoints: function(category) {
    $.ajax({url:'/api/data', data:{category: category}})
      .done(function(results) {
        this.setState(results);
      }.bind(this));
  },

  changeCategory: function(category) {
    this.loadPoints(category);
    this.setState({activeCategory: category});
  },

  loadCategories: function() {

    $.ajax('/api/categories').done(function(data) {
      // gets categories by last update date and if
      // category that was created but there is no record
      // use the created date

      var updatedCategories = this.categoryTiming(data);

      var updatedKeys = Object.keys(updatedCategories);
      var activeCategory = updatedKeys.reduce(function(acc, item) {
        var accDate = new Date(updatedCategories[acc]);
        var itemDate = new Date(updatedCategories[item]);
        return  accDate > itemDate ? acc : item
      });

      this.setState({
        activeCategory: activeCategory,
        categories: Object.keys(updatedCategories)
      });

      this.loadPoints(this.state.activeCategory);

    }.bind(this));
  },

  categoryTiming: function(data) {
    var recentUpdates = data.categoriesByUpdate.reduce(function(acc, item) {
      acc[item._id] = item.recent;
      return acc;
    }, {});

    var recentCategories = data.categoriesByCreated.reduce(function(acc, item) {
      if (!(item.category in acc)) {
        acc[item.category] = item.date;
        return acc;
      } else {
        return acc;
      };
    }, recentUpdates)

    return recentCategories;
  },

  incrementCount: function() {
    var incrementAmount = parseInt(document.getElementById('input-number').value);
    if (incrementAmount < 1 || isNaN(incrementAmount)) {
      alert('Amount must be more than 0!')
    } else {
      this.createRecord(incrementAmount);
    }
  },

  decrementCount: function() {
    var incrementAmount = parseInt(document.getElementById('input-number').value);
    if (incrementAmount < 1 || isNaN(incrementAmount)) {
      alert('Amount must be more than 0!')
    } else {
      var last = this.state.dailyData.length - 1;
      var removeAmount = Math.min(incrementAmount, this.state.dailyData[last]);
      this.createRecord(-removeAmount);
    };
  },

  createRecord: function(amount) {
    if (this.state.user !== null) {
      this.sendCreateRequest(amount);
    } else {
      this.updateGuestData(amount);
    };
  },

  sendCreateRequest: function(amount) {
    var entry = {
      'userId': this.state.user,
      'category': this.state.activeCategory,
      'amount': amount
    };

    $.ajax({
      type: 'POST',
      url: '/api/add',
      contentType: 'application/json',
      data: JSON.stringify(entry),
      success: function(data) {
        this.setState(data);
      }.bind(this),
      error: function(xhr, status, err) {
        console.log('Error adding entry: ', err);
      }
    });
  },

  updateGuestData: function(amount) {
    var last = this.state.dateLabels.length - 1;
    var copy = this.state.dailyData.slice();
    copy[last] = copy[last] + amount;
    this.setState({
      dailyData: copy,
      cumulativeData: copy,
    });
  },

  render: function() {

    return (
      <Grid className='main'>
        <NavbarInstance
          user={this.state.user}
          categories={this.state.categories}
          activeCategory={this.state.activeCategory}
          change={this.changeCategory}
        />
        <ChartContainer {...this.state} />
        <ButtonContainer
          incrementCount={this.incrementCount}
          decrementCount={this.decrementCount}
        />
      </Grid>
    );
  }
});

module.exports = Main;

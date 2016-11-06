
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
      var updatedCategories = data.reduce(function(acc, item) {
        acc.push(item._id);
        return acc;
      }, []);

      var activeCategory = data.reduce(function(acc, item) {
        if (new Date(acc.recent) > new Date(item.recent)) {
          return acc;
        } else {
          return item;
        }
      });

      this.setState({
        activeCategory: activeCategory._id,
        categories: updatedCategories
      });

      this.loadPoints(this.state.activeCategory);

    }.bind(this));
  },

  addOne: function() {
    if (this.state.user !== null) {
      var entry = {
        'userId': this.state.user,
        'category': this.state.activeCategory
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
    } else {
      var last = this.state.dateLabels.length - 1;
      var copy = this.state.dailyData.slice();
      copy[last]++;
      this.setState({
        dailyData: copy,
        cumulativeData: copy,
      });
    };
  },

  render: function() {

    return (
      <Grid className='main'>
        <NavbarInstance
          user={this.state.user}
          categories={this.state.categories}
          title={this.state.activeCategory}
          change={this.changeCategory}
        />
        <ChartContainer {...this.state} />
        <ButtonContainer addOne={this.addOne}/>
      </Grid>
    );
  }
});

module.exports = Main;

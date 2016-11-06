
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
      categories: ['General', 'Two', 'Three', 'Four']
    };
  },

  componentDidMount: function() {
    this.loadData();
  },

  loadData: function() {
    $.ajax('/api/data').done(function(data) {
      this.setState(data);
      this.loadCategories();
    }.bind(this));
  },

  loadCategories: function() {
    if (this.state.user !== null) {
      $.ajax('/api/categories').done(function(data) {
        var updatedCategories = data.reduce(
          function(acc, item){
            acc.push(item._id);
            return acc
          },[]
        )
        this.setState({categories: updatedCategories});
      }.bind(this));
    };
  },

  addOne: function() {
    if (this.state.user !== null) {
      var entry = {
        'userId': this.state.user
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
        />
        <ChartContainer {...this.state} />
        <ButtonContainer addOne={this.addOne}/>
      </Grid>
    );
  }
});

module.exports = Main;
